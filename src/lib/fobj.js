var F = {
  // Enumerations

  ForecasterFileType: {
    UNREADABLE: 1,
    BINARYSTREAM: 2,
    XMLPLAINTEXT: 3,
    XMLENCODED: 4,
  },

  Export: {
    RESULTDISPLAYMONTCARLO: 1,
    RESULTDISPLAYDECISIONRULES: 2,
    RESULTDISPLAYJOURNALED: 3,
    COMPONENTONLY: 5,
    CHILDONLY: 6,
    COMPONENTWITHCHILDREN: 7,
  },

  SortTarget: {
    NOTARGET: 0,
    TREEVIEWSEQUENCE: 1,
    PARAMETERCHANGEDATE: 2,
    DEFAULTSHORTFALLRANK: 5,
    ASSIGNEDSHORTFALLRANK: 6,
    DEFAULTSHORTFALLSORTINDEX: 7,
  },

  // Tree node display names for the top level tree
  persons: 'Persons',
  accounts: 'Normal Taxable Accounts',
  iras: 'IRAs & Other Deferred Plans',
  pensions: 'Pensions & Other Income',
  annuities: 'Annuities',
  insurances: 'Insurance Policies',
  parameters: 'Global Plan',
  summary: 'Summary',

  ROOT_TREE_NAME: 'MoneyPlan',
  PERSONS_TREE_NAME: 'Persons',
  ACCOUNTS_TREE_NAME: 'Normal Taxable Accounts',
  IRAS_TREE_NAME: 'IRAs & Other Deferred Plans',
  PENSIONS_TREE_NAME: 'Pensions & Other Income',
  ANNUITIES_TREE_NAME: 'Annuities',
  INSURANCES_TREE_NAME: 'Insurance Policies',
  ASSETS_TREE_NAME: 'Plan Assets',
  PARAMETERS_ASSET_LEVEL_TREE_NAME: "Plan's Parameters",
  PARAMETERS_TREE_NAME: 'Global Plan',
  SUMMARY_TREE_NAME: 'Summary',

  // create other tree node ID values on the go, starting from 100, they are good for each session only.
  ASSETS_TREE_ID: 0,
  SUMMARY_TREE_ID: 10,
  PERSONS_TREE_ID: 20,
  ACCOUNTS_TREE_ID: 30,
  IRAS_TREE_ID: 40,
  PENSIONS_TREE_ID: 50,
  ANNUITIES_TREE_ID: 60,
  INSURANCES_TREE_ID: 70,
  PARAMETERS_COLLECTION_TREE_ID: 80,
  PARAMETERS_TREE_ID: 90,
  OBJECT_TREE_ID: 100, //incremented for each new object not listed above, used as collection key and tree ID

  SUMMARYOBJECTIDSTAMP: 'Summary',
  PLANDESCRIPTIONIDSTAMP: 'PlanDescription',
  RUNASISBUTTON: 45, //fictional button for data entry dialog at start of Monte Carlo sim run
  RECALCULATEBUTTON: 46, //fictional button for data entry dialog at start of Monte Carlo sim run
  FORCECATCH: 3333, //local error number to force branch to Catch logic code
  NL$: '\n', //vbCrLf
  T$: '\t', //vbTab//Chr$(9)
  CR$: '\r', //vbCr//Chr$(13)
  PLANSAVELIMIT: 2, //individual non-registered user's limit for saved plans
  PLANSERIALBREAK6: 1000, //code used to assign saved plan limit value
  PLANSERIALBREAK5: 900, //code used to assign saved plan limit value
  PLANSERIALBREAK4: 800, //code used to assign saved plan limit value
  PLANSERIALBREAK3: 700, //code used to assign saved plan limit value
  PLANSERIALBREAK2: 600, //code used to assign saved plan limit value
  PLANSERIALBREAK1: 500, //bottom boundry of code used to assign saved plan limit value

  GRIDVIEWPRINTCHARACTERLIMIT: 40, //used to break up long description strings

  LEVEL0INDENT: 0,
  LEVEL1INDENT: 30,
  LEVEL2INDENT: 60,
  LEVEL3INDENT: 90,
  TRUESTRING: 'True',
  USERFILENAME: 'moneyplanusers.dat',
  //USEDESCRIPTION: "The period for using this beta version of Forecaster expires on ", //<date>
  //FORECASTERHOMEPAGE: "http://www.retirementforecaster.com",
  //FORECASTERREGISTRATIONPAGE: "http://www.retirementforecaster.com/register.html",
  APPLICATIONNAME: 'MoneyPlan',
  APP_NAME: 'MoneyPlan', //used in registry for MRU file entries
  UNTITLEDFILENAME: 'Untitled',
  PLANOUTLINE: 'Plan Outline', //standard name for Outline form
  ALLRESULTS: 'Combined Yearly Results', //standard name for Results graph
  ESTATERESULTS: 'Estate Planning Results', //standard name for Estate graph
  MONTECARLOSIMULATION: 'Monte Carlo Simulation', //standard name for Monte Carlo form
  MAKENEWSELECTION: 'Make new selection', //for combobox
  CALCULATE: 'Calculate Your Money Plan With Your Specified Numbers',
  SIMULATE: 'Run Monte Carlo Simulation With Your Uncertain Numbers',
  ERRORMESSAGEFLAG: '####',
  DATEFORMAT: '{0:MMM d yyyy}', //the VB .net format string
  DATES: 'MMM d yyyy', //the VB6 format string
  DOLLARSFORMAT: '{0:###,###,###,##0}', //the VB .net format string
  DOLLARS: '###,###,###,##0', //the VB6 format string
  DOLLARSWITHOUTCOMMAS: '###########0', //the VB6 format string
  DELIMITOR: '******',
  VALUEDIVISOR: 1000,
  //REGAPPNAME: "RetirementForecaster", //for storing data in the registry
  //REGSECTION: "Data", //for storing data in the registry
  //PHONEHOMENOTICE: "NOTE: This program sends a message to the" + '\n' + "RetirementForecaster Web site to check" + '\n' //+ "for a new version at every startup." + '\n' + "This may cause a slight delay in the program's initialization.",
  //PHONEHOMENOTICESPLASH: "NOTE: This program" + '\n' + "sends a message to the RetirementForecaster" + '\n' + "Web site //to check for a new version at every startup." + '\n' + "See ""Help/About...""",
  //UPDATECHECKNOTE: '\n' + "Use ""Help/Test For New Version...""" + '\n' + "to test for an available update.",
  DATAENTRYWINDOWNORMAL: '1',
  DATAENTRYWINDOWMONTECARLO: '2',

  PRINTSINGLENOT: 0,
  PRINTOUTLINE: 1,
  PRINTPERSONDATA: 2,
  PRINTRESULTS: 3,
  PRINTOBJECTDATA: 4,
  PRINTPARAMDATA: 5,
  PRINTTITLEPAGE: 6,
  PRINTSETUP: 7,
  PRINTOVERALLRESULTS: 8,
  PRINTESTATERESULTS: 9,
  PRINTMONTECARLORESULTS: 10,

  //Collection Names for XML elements
  ANNUITY_COLLECTION_ID: 'annuities',
  ACCOUNT_COLLECTION_ID: 'accounts',
  INSURANCE_COLLECTION_ID: 'insurances',
  IRA_COLLECTION_ID: 'iras',
  PENSION_COLLECTION_ID: 'pensions',
  PERSON_COLLECTION_ID: 'persons',
  PARAMS_COLLECTION_ID: 'parameters',
  BENEFICIARY_COLLECTION_ID: 'beneficiaries',
  TRANSFER_COLLECTION_ID: 'transfers',
  DEPOSIT_COLLECTION_ID: 'deposits',
  PAYIN_COLLECTION_ID: 'payins',
  PAYOUT_COLLECTION_ID: 'payouts',
  COST_COLLECTION_ID: 'costs',
  WITHDRAWAL_COLLECTION_ID: 'withdrawals',
  PARAMETERCHANGE_COLLECTION_ID: 'parameterchanges',
  ASSIGNEDSOURCERANK_COLLECTION_ID: 'assignedsourceranks',

  //Parent Collection and Plan Object type identifiers
  FORECASTER_ID: 'forecaster',
  COLLECTION_ID: 'collection',
  ASSETCOLLECTION_ID: 'assetcollection',
  ANNUITY_ID: 'annuity',
  ACCOUNT_ID: 'account',
  INSURANCE_ID: 'insurance',
  IRA_ID: 'ira',
  PENSION_ID: 'pension',
  PERSON_ID: 'person',
  PARAMS_ID: 'params',
  SUMMARY_ID: 'summary',
  ALLPLANRESULTS_ID: 'planresults',
  MONTECARLORESULTS_ID: 'montecarloresults',
  DECISIONRULESRESULTS_ID: 'decisionrulesresults',
  MARKETSIMULATIONRESULTS_ID: 'marketsimulationresults',
  SHORTFALLACCOUNT_ID: 'shortfallaccount',
  PLANDESCRIPTION_ID: 'plandescription',

  //Child Collection and Instruction type identifiers
  BENEFICIARY_ID: 'beneficiary',
  TRANSFER_ID: 'transfer',
  DEPOSIT_ID: 'deposit',
  PAYIN_ID: 'cost',
  COST_ID: 'cost',
  PAYOUT_ID: 'withdrawal',
  PARAMETERCHANGE_ID: 'parameterchange',
  ASSIGNEDSOURCERANK_ID: 'assignedsourcerank',

  THIRDPARTYOWNER: 'Third Party',

  //These are transaction codes for housekeeping procedures
  IGNORE: 0,
  INITIALIZECALCULATION: 1,
  INITIALIZEYEARLY: 2,
  FINISHYEARLY: 3,
  //AFTERFINALYEAR: 4,
  FINISHCALCULATION: 5,
  FINDAVERAGEROI: 6,

  //These are codes for increases to the payout target
  //for things like life insurance premiums, tax liabilities, etc
  //COVERLIFEINSURANCEPREMIUMS: 11,
  COVERMANDATEDPAYMENTS: 12,
  //COVERTAXLIABILITIES : 13,

  //These are codes for outside income and investment increases in account balances
  ADDDEPOSITS: 15,
  ADDINVESTMENTEARNINGS: 16,
  ADDCAPITALGAINS: 17,
  ADDDIVIDENDS: 18,

  //These are codes for beneficiary/transfer payments to account/person balances, all
  //handled together, and these are now (in version 3) used instead of the separate ones
  //below that before (in version 2) were done sequentially for accounts and then persons.
  PAYLIFEINSURANCEBENEFITS: 20,
  PAYOWNERDEATHBENEFITS: 21,
  PAYMONEYTRANSFERS: 22,
  PAYTRANSFERSBEFOREEARNINGSCALCULATED: 24,
  RECEIVEMONEYTRANSFERS: 26,

  //These are codes for changes to account balances
  //PAYLIFEINSURANCEBENEFITSTOACCOUNTS: 28,
  //PAYOWNERDEATHBENEFITSTOACCOUNTS: 29,
  //PAYMONEYTRANSFERSTOACCOUNTS: 30,
  //These are codes for changes to person balances
  //PAYLIFEINSURANCEBENEFITSTOPERSONS: 33,
  //PAYOWNERDEATHBENEFITSTOPERSONS: 34,
  //PAYMONEYTRANSFERSTOPERSONS: 35,

  //These are codes for the sources of payout funds
  GETPENSIONPAYMENTS: 41,
  GETANNUITYPAYMENTS: 42,
  GETFIXEDPAYOUTS: 43,
  GETIRAELECTIVES: 44,
  GETIRAMINIMUMS: 45,
  GETIRALIMITED: 46,
  GETIRAUNRESTRICTED: 47,
  //GETIRABEST : 48,

  GETDISCRETIONARYPAYOUTS: 51,
  GETTAXFREEACCOUNTPAYOUTS: 52,
  GETANNUITYPAYOUTS: 53,
  GETLONGTERMASSETPAYOUTS: 55,
  GETRANKEDPAYOUTS: 56,
  GETUNRANKEDPAYOUTS: 57,

  //These are codes for other yearly transactions
  PAYIRADISTRIBUTIONTAX: 60,
  //PAYLIFEINSURANCEPREMIUMS: 61,
  PAYMANDATEDPAYMENTS: 62,
  //PAYOTHERTAXLIABILITY : 63,
  PAYEXCESSTOSURPLUSDEST: 64,

  //This is a special-use code for testing the presence of a certain withdrawal instruction
  TESTFORREMOVALOFREALIZEDGAIN: 65,

  //These codes identify the calculation display grid for determining formating requirements
  YEARLYGRID: 1,
  JOURNALGRID: 2,
  ESTATEGRID: 3,
  ALLRESULTSGRID: 4,
  PENSIONGRID: 5,
  MONTECARLOGRID: 6,
  DECISIONRULESGRID: 7,

  //These codes identify the calculation display chart for determining formating requirements
  LINECHART: 1,
  AREACHART: 2,
  PIECHART: 3,
  HISTOGRAM: 4,
}

module.exports = F
