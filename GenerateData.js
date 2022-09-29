const { getSdk } = require('@balena/jellyfish-client-sdk');
const fs = require('fs');
const sheet = require('./SheetData.js');

// Create a new SDK instance, providing the API url and prefix
const sdk = getSdk({
    apiUrl: "https://api.ly.fish",
    apiPrefix: "api/v2/",

});

let data = [];
let nodesAdded = [];

async function GetData() {

    // Authorise the SDK using an auth token
    let token = process.env.JF_TOKEN;
    if (!token)
    {
        console.error("Jellyfish token not set. Set JF_TOKEN in enVars");
        process.exit();
    }
    sdk.setAuthToken(token);

    try {
        data = await sheet.getSheetsData();
        nodesAdded = data.nodes.map(d => d.id);
        console.log("Got Google Sheets data");
    }
    catch (error) {
        console.log(error);
    }

    try{
        console.log("Creating Sagas first");
        let sagas = await sdk.card.getAllByType("saga@1.0.0");
        for (let saga of sagas) {
            if (saga.data.status === 'open') {
                AddNodeOrIgnoreDuplicate(saga);
            }
        }
    }
    catch (error)
    {
        console.log(error);
    }

    try {
        console.log("Getting all improvements");
        let improvements = await sdk.card.getAllByType("improvement@1.0.0");
        for (let improvement of (improvements.filter(c => (['implementation', 'ready-to-implement', 'awaiting-approval'].includes(c.data.status))))) {
            AddNodeOrIgnoreDuplicate(improvement);

            await sdk.card.getWithLinks(improvement.slug, ['is attached to'])
                .then((improvementCard) => {
                    if (improvementCard) {
                        if (improvementCard.links) {
                            for (var saga of (improvementCard.links['is attached to'].filter(l => (l.type === 'saga@1.0.0')))) {
                                AddNodeOrIgnoreDuplicate(saga);
                                AddLink(saga, improvement);
                            }
                            for (var pattern of (improvementCard.links['is attached to'].filter(l => (l.type === 'pattern@1.0.0')))) {
                                AddNodeOrIgnoreDuplicate(pattern);
                                AddLink(improvement, pattern);
                            }
                        }
                    }
                });
            await sdk.card.getWithLinks(improvement.slug, ['is owned by'])
                .then((improvementCard) => {
                    if (improvementCard) {
                        if (improvementCard.links) {
                            for (var owner of (improvementCard.links['is owned by'])) {
                                if (owner) {
                                    AddNodeOrIgnoreDuplicate(owner);
                                    AddLink(improvement, owner);
                                }
                            }
                        }
                    }
                });
            await sdk.card.getWithLinks(improvement.slug, ['is contributed to by'])
                .then((improvementCard) => {
                    if (improvementCard) {
                        if (improvementCard.links) {
                            for (var contributor of (improvementCard.links['is contributed to by'])) {
                                if (contributor) {
                                    AddNodeOrIgnoreDuplicate(contributor);
                                    AddLink(improvement, contributor);
                                }  
                            }
                        }
                    }
                });
        }

        return data;
    }
    catch (error)
    {
        console.log(error);
    }

}

function AddLink(source, target)
{
    data.links.push({
        "source": source.slug,
        "target": target.slug,
        "weight": (source.data.weight || 0) + (target.data.weight || 0),
        "sourceType": source.type.substring(0, source.type.indexOf('@')),
        "targetType": target.type.substring(0, target.type.indexOf('@'))
    });
}

function AddNodeOrIgnoreDuplicate(card) {
    if (!nodesAdded.includes(card.slug)) {
        data.nodes.push({
            "id": card.slug,
            "name": card.name,
            "group": card.type.substring(0, card.type.indexOf('@')),
            "weight": card.data.weight || 0,
            "status": card.data.status,
            "Link": "https://jel.ly.fish/" + card.slug
        });

        nodesAdded.push(card.slug);
    }
    else {
        console.log("Ignoring duplicate: " + card.slug);
    }
}


console.log("Generating data file");
GetData().then(result => { fs.writeFileSync('./src/client/cy-conf/data.json', JSON.stringify(result)); });
