export default { //initial store data

    planview: { 
        name: "", //plan file
        planobject: {forecaster: { parameters: [], persons: [], accounts: [], iras: [], pensions: [], annuities: [], insurances: [] }}, //deepObject
        sorting: false, //boolean
        selectedNode: "", //path.path.path... 
        lastchartsource: "" //JSON of plan sent to charting
    },

    charts: [ //Array of charts
        {
            chartname: "", //one chart
            chartdata: [ //Array of data objects
                {
                    lineledgend: [], //Array of names
                    linedata: {}, //deepObject
                    linevisible: [], //Array of booleans
                    yearlyresultsdata: {}, //deepObject
                    journaldata: {}, //deepObject
                    pieledgend: [], //Array of names
                    piedata: {}, //deepObject
                }
            ],
        },
        {} //next chart
    ],

    forms: [
        {
            formname: "", //one form
            formdata: [ //Array of data objects
                {
                    fielddata: {}, //deepObject
                }
            ],
        },
        {} //next form
    ]
}