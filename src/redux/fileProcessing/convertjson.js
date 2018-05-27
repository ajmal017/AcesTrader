// convertjson.js

// SEE file: ReadMePropertyValueQuirks.txt

exports.convertdata = (store, testStore) => {
  'use-strict'

  var planJson1 = store.planJson

  // Fix mistake in using title cased "ObjectType"
  if (/ObjectType/.test(planJson1)) {
    planJson1 = planJson1.replace(/ObjectType/g, 'objecttype')
    // debugger;
  }

  // Replace confusing property name with the appropriate one
  if (/payin/.test(planJson1)) {
    planJson1 = planJson1.replace(/payin/g, 'cost')
    // debugger;
  }

  // // **TOO MANY SIDE EFFECTS TO USE THIS**
  // Replace confusing property name with the appropriate one
  // if (/payout/.test(planJson1)) {
  //     planJson1 = planJson1.replace(/payout/g, "withdrawal");
  //     debugger; //OK
  // }

  // // HANDLE THIS IN CODE WHEN SITUATION IS UNDERSTOOD
  // if (/deposittoira/.test(planJson1)) { //seen, but no action taken
  //     debugger;
  // }

  // HANDLE THIS IN CODE WHEN SITUATION IS UNDERSTOOD
  if (/distributionfromira/.test(planJson1)) {
    //seen, but no action taken yet
    // if (process.env.NODE_ENV !== 'production') { debugger };  //pause for developer inspection
  }

  // **POSSIBLE SIDE EFFECTS NOT ABLE TO BE TESTED**
  if (/payoutisfromira/.test(planJson1)) {
    // Not seen in samples
    if (process.env.NODE_ENV !== 'production') {
      debugger
    } //pause for developer inspection
  }

  // **POSSIBLE SIDE EFFECTS NOT ABLE TO BE TESTED**
  if (/taxNormalLongTermRealizedGains/.test(planJson1)) {
    // Not seen in samples
    // planJson1 = planJson1.replace(/taxNormalLongTermRealizedGains/g, "taxNormalLongTerm");
    if (process.env.NODE_ENV !== 'production') {
      debugger
    } //pause for developer inspection
  }

  // **POSSIBLE SIDE EFFECTS NOT ABLE TO BE TESTED**
  if (/taxNormalLongTerm/.test(planJson1)) {
    // Not seen in samples
    // planJson1 = planJson1.replace(/taxNormalLongTerm/g, "taxNormalLongTermRealizedGains");
    if (process.env.NODE_ENV !== 'production') {
      debugger
    } //pause for developer inspection
  }

  if (testStore) {
    testStore.planJson3 = planJson1.slice() //the new json
  }
  return planJson1 //updated
}
