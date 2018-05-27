//****  This code is not originally part of this module. Added by BCM 1/28/2015. ****
//Falling back to using "TaxNormalLongTerm" so that we can test xml strings against older example files still using that.
//But legacy plan files may be using "TaxNormalLongTermRealizedGains", and that should override in the calculations,
//yet not effect the generated output xml string so that our output tests can still be used.
//Here we test the value of both properties and return the value that is to be used in the program.
exports.getPropertyValue = function (taxNormalLongTermRealizedGains, taxNormalLongTerm) {
	var value1 = taxNormalLongTermRealizedGains; //this is left undefined by default so as not to be included in the output xml file, if not present in the input xml file
	var value2 = taxNormalLongTerm; //this is set to false by default
	if (typeof value1 === 'undefined' || value1 === null || value1.length === 0) { // isNullOrEmpty
		return value2; // we will use the standard property value
	}
	if (value1 === -1 || value1 === false) { //could be set to this by a legacy input xml file, so it will be included in the output xml file.
		return value2; // we will use the standard property value
	}
	return value1; // this legacy property value overrides the standard one since it was set by a legacy input xml file
}
-------------------------------------------------------------------------------------------------------------------------------
	'Since both of the long-term account variables exist in an account object, one may be false while the other is true,
	'and since the sequence of arrival is unknown, we use the logic below to make an OR condition,
	'resulting in TaxNormalLongTermRealizedGains having the resultant value. Note that TaxNormalLongTerm
	'can be used as a scratch variable since it is obsolete in the program logic.
Case "taxnormallongterm", "taxnormallongtermrealizedgains"
	TaxNormalLongTerm = CBool(datavalue)
	If TaxNormalLongTerm Then TaxNormalLongTermRealizedGains = TaxNormalLongTerm 'new account type takes over
	TaxNormalLongTerm = False 'reset
-------------------------------------------------------------------------------------------------------------------------
Case "deposittoira"
	'This is handled in ParseXMLNodes() to flag early instances of Deposit objects    'DepositToIRA = CBool(datavalue)
Case "distributionfromira" ', "payoutisfromira"
	'This is handled in ParseXMLNodes() to flag early instances of payout/transfer objects   'DistributionFromIRA = CBool(Datavalue)
	
Case "assetclassname" 'ignore obsolete name left from testing
Case "dividendpaidrate" 'obsolete
Case "taxcustomspecification" 'obsolete
Case "taxlongtermallocatedrealizedgains" 'obsolete
Case "taxact2010rescindedatsunsetyear" 'BCM- introduced in version 3.0.66 lost in Oct 2012, forcing a transition from 3.0.65 to 3.0.67
Case "allowearlywithdrawals" 'for compatibilty with IRA accounts in extant plan files done before version 3.0.51. This is always true by default in 3.0.51 and later, i.e. IRAs are always available for shortfalls (according to their ranking)
Case "treeviewsequence" 'this dataitem is temporarily created at run time, not saved, but some may be out there in files, so ignore.


