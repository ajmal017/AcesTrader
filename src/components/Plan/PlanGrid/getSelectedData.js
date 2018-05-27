// getSelectedData.js
// Formatter for the tree node's data table

import { objectQuery, getInstructionParentPath } from '../../../lib/navigateBreadCrumbs'
var accounting = require('../../../lib/accounting') //gets the accounting methods
var F = require('../../../lib/fobj') //gets the static object of constants

const getSelectedData = (props) => {
  'use-strict'
  let myObject = props.myObject
  const targetPath = props.targetPath
  const planObject = props.planObject
  const quickbuildFormat = props.quickbuildFormat || false
  let ownerObject = null
  let comment = ''
  let planDataArray = [] //the output array of arrays of each grid line's item + value

  const getParent = function(startPath = targetPath) {
    //default startPath is the targetPath saved by Forecaster's onClick handler
    let parentPath = getInstructionParentPath(startPath)
    let parentObject = objectQuery(parentPath, planObject)
    // debugger; //for developer's inspection
    return parentObject
  }

  const isNullOrEmpty = function(value) {
    return typeof value === 'undefined' || value === null
  }

  const cStr = function(s) {
    if (!isNullOrEmpty(s)) {
      return s.toString()
    }
    if (process.env.NODE_ENV === 'development') {
      debugger
    } //TODO remove if no hits
  }

  const addLine = function(data1, data2) {
    if (!isNullOrEmpty(data2)) {
      //this test still allows data2 string of length=0
      let row = []
      row.push(data1.trim())
      row.push(data2.trim())
      planDataArray.push(row)
    }
  }

  const useChildForData = function(currentObject) {
    //when current object is Plan Parameters
    let objectKeys = Object.keys(currentObject) //keys of object's properties
    let childKeys = objectKeys.filter(function(key) {
      //get only the keys of child objects
      return typeof currentObject[key] === 'object' && Object.keys(currentObject[key]).length > 0 //not an empty object
    })
    if (childKeys.length === 0) {
      return null //no child objects
    }
    if (childKeys.length === 1) {
      //the expected result
      let childObject = currentObject[childKeys[0]] //the child object
      return childObject[0]
    }
  }

  const collectionCount = function(currentObject) {
    let objectKeys = Object.keys(currentObject) //keys of object's properties
    let childKeys = objectKeys.filter(function(key) {
      //get only the keys of child objects
      return typeof currentObject[key] === 'object' && Object.keys(currentObject[key]).length > 0 //not an empty object
    })
    if (childKeys.length === 0) {
      return 0 //no child objects
    }
    if (childKeys.length === 1) {
      //the expected result
      return currentObject[childKeys[0]].length //the size of the array of child objects
    }
    if (process.env.NODE_ENV === 'development') {
      debugger
      return 9 //TODO for debugging - continue to return to caller
    } //developer testing
  }

  switch (myObject.objecttype) {
    case F.FORECASTER_ID:
      addLine('  - - - - - - - - - - - - - - - -', ' ')
      addLine('  - - - - - MoneyPlan  - - - - - -', ' ')
      addLine('  - - objecttype="forecaster" - - -', ' ')
      addLine('  - - - - - - - - - - - - - - - -', ' ')
      break
    case F.SUMMARY_ID:
      // ******************************************
      // Note: This Summary display is on hold and may not be done
      // ******************************************
      myObject.retirementlivingexpense = 0
      myObject.totalira401k = 0
      myObject.totalroth = 0
      myObject.totalotherasset = 0
      myObject.totallongtermasset = 0
      myObject.totalcost = 0
      myObject.totalpension = 0
      myObject.totalincome = 0
      myObject.totalinsurancebenefit = 0
      myObject.totalannuitybenefit = 0
      //if (!myObject.collectsummarytotals()) { //nothing defined yet
      //	if ((LineManager.PrintArrayList) || (LineManager.DataGrid && LineManager.DataGrid.Columns.Count > 0)) {
      //		addLine("  - - No Data Yet - -", " ");
      //		if (!PlanList.LimitCheck) { //user is at limit for new files
      //			var Msg1, Msg2;
      //			Msg1 = "You are using the unregistered, free version of Forecaster,";
      //			Msg1 += " and you have reached your limit of " + CStr(PlanList.FileNumberLimit) + " saved plans.";
      //			Msg1 += "\n\n" + "If (you intend to save a new plan, you will have to delete an old file,";
      //			Msg1 += " one that you previously saved.";
      //			Msg1 +=  "\n\n" + "Click on the" +  "\n" + "Tools/Allowed Files..." +  "\n" + "menu selection to do this.";
      //			Msg2 = "   ALERT";
      //			addLine(Msg2, Msg1);
      //			Return; //no objects built yet
      //        }
      //	}
      //	//Return; //no objects built yet
      //}
      if (quickbuildFormat) {
        addLine('  - - - - - - - - - - - - - -', ' ')
      } else {
        addLine('  - - Selective Summary - -', ' ')
        addLine('  - - - - - - - - - - - - - -', ' ')
        addLine(' Retirement Living Expenses', accounting.formatNumber(myObject.retirementlivingexpense))
        addLine('  - - - - - - - - - - - - - -', ' ')
      }
      if (myObject.totalcost > 0) {
        addLine(' Total Recurring Costs (For Two Or More Years)', accounting.formatNumber(myObject.totalcost))
        addLine('  - - - - - - - - - - - - - -', ' ')
      }

      addLine(' Total Tax Normal Short Term Assets', accounting.formatNumber(myObject.totalotherasset - myObject.TotalLongTermAsset))
      addLine(' Total Long-Term Capital Gain Assets', accounting.formatNumber(myObject.totallongtermasset))
      addLine(' Total Traditional IRAs + 401(k)s', accounting.formatNumber(myObject.totalira401k))
      addLine(' Total Roth IRAs', accounting.formatNumber(myObject.totalroth))
      addLine(' Total Pensions + Social Security', accounting.formatNumber(myObject.totalpension))
      if (!quickbuildFormat) {
        addLine(' Total Other Incomes', accounting.formatNumber(myObject.totalincome))
        addLine(' Total Insurance Benefits', accounting.formatNumber(myObject.totalinsurancebenefit))
        addLine(' Total Annuity Benefits', accounting.formatNumber(myObject.totalannuitybenefit))
      }
      //if (TotalIRA401k > 0) { addLine(" Total IRAs + 401(k)s", accounting.formatNumber(TotalIRA401k))
      //if (TotalRoth > 0) { addLine(" Total Roth IRAs", accounting.formatNumber(TotalRoth))
      //if (TotalOtherAsset > 0) { addLine(" Total Other Assets", accounting.formatNumber(TotalOtherAsset))
      //if (TotalPension > 0) { addLine(" Total Pensions", accounting.formatNumber(TotalPension))
      //if (TotalIncome > 0) { addLine(" Total Other Incomes", accounting.formatNumber(TotalIncome))
      //if (TotalInsuranceBenefit > 0) { addLine(" Total Insurance Benefits", accounting.formatNumber(TotalInsuranceBenefit))
      //if (TotalAnnuityBenefit > 0) { addLine(" Total Annuity Benefits", accounting.formatNumber(TotalAnnuityBenefit))
      myObject.totalassets = myObject.TotalIRA401k + myObject.TotalRoth + myObject.TotalOtherAsset

      //if (myObject.plandesc === "") {
      //    addLine(" The Plan's Description", " - No Description -");
      //} else {
      //    addLine(" The Plan's Description", myObject.plandesc);
      //}

      // NOTE- F.Parameters is undefined
      //if (F.Parameters.Title) {
      //	addLine(" The Plan's Description", F.Parameters.Title);
      //} else {
      //	addLine(" The Plan's Description", " - No Description -");
      //}
      break
    case F.ANNUITY_ID:
      addLine(" Annuity's Title", myObject.title)
      addLine(' Owner', myObject.initialowner)
      if (myObject.initialjointowner) {
        addLine(' Joint Owner', myObject.initialjointowner)
      }
      addLine(' A Variable Annuity', myObject.variableannuity ? 'True' : 'False')
      switch (true) {
        case myObject.variableannuity:
          //if (StartingValue >= 0) {
          //    addLine(" Starting Value", accounting.formatNumber(myObject.startingvalue))
          //} else { //must be -1 = empty
          //    addLine(" Starting Value", "")
          //}
          addLine(' Starting Total Value Of Account', accounting.formatNumber(myObject.startingvalue))
          addLine(' Starting Value Of Your Contributions', accounting.formatNumber(myObject.startingcontributionvalue))
          if (myObject.annuitycommencementyear > 0) {
            addLine(' Annuity Commencement Year', cStr(myObject.annuitycommencementyear))
            if (myObject.annuitizationinterestrate > 0) {
              addLine(' Assumed Annuitization Interest Rate', accounting.formatPercent(myObject.annuitizationinterestrate))
            } else {
              addLine(' Assumed Annuitization Interest Rate', 'Missing')
            }
          } else {
            addLine(' Annuity Commencement Year', 'Not Annuitized')
            addLine(' Assumed Annuitization Interest Rate', '')
          }
          break
        default:
          addLine(' Purchase Cost Of Annuity', accounting.formatNumber(myObject.startingcontributionvalue))
          addLine(' Annuity Commencement Year', cStr(myObject.annuitycommencementyear))
          switch (true) {
            case myObject.singlelifeannuitypolicy:
              addLine(' Single Life Annuity Policy', cStr(myObject.singlelifeannuitypolicy))
              addLine(' Single Life Annuity Amount', accounting.formatNumber(myObject.singlelifeannuityamount))
              break
            case myObject.termcertainannuitypolicy:
              addLine(' Term Certain Annuity Policy', cStr(myObject.termcertainannuitypolicy))
              addLine(' Term Certain Period', cStr(myObject.termcertainperiod))
              addLine(' Term Certain Annuity Amount', accounting.formatNumber(myObject.termcertainamount))
              break
            case myObject.contingentannuitantpolicy:
              addLine(' Contingent Annuitant Policy', cStr(myObject.contingentannuitantpolicy))
              addLine(' Contingent Policy Life Annuity Amount', accounting.formatNumber(myObject.contingentannuitantlifeannuityamount))
              addLine(' Contingent Beneficiary Percentage', accounting.formatPercent(myObject.contingentbeneficiarypercentage))
              break
            default:
              if (process.env.NODE_ENV === 'development') {
                debugger
              } //developer testing
          }
          break
      }
      if (myObject.specificroiforthisaccount !== -1) {
        addLine(' Specific Earnings Percentage Rate', accounting.formatPercent(myObject.specificroiforthisaccount))
        if (myObject.specificsdforthisaccountroi !== -1) {
          addLine(' Specific Earnings Rate Standard Deviation', accounting.formatPercent(myObject.specificsdforthisaccountroi))
        }
      }
      if (myObject.specifictaxrateforthisaccount !== -1) {
        addLine(' Specific Federal Income Tax Rate', accounting.formatPercent(myObject.specifictaxrateforthisaccount))
      }
      if (myObject.specificfedtaxrateforthisaccount !== -1) {
        addLine(' Specific Federal Income Tax Rate', accounting.formatPercent(myObject.specificfedtaxrateforthisaccount))
      }
      if (myObject.specificstatetaxrateforthisaccount !== -1) {
        addLine(' Specific State Income Tax Rate', accounting.formatPercent(myObject.specificstatetaxrateforthisaccount))
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      addLine(' Shortfall Withdrawal Rank', myObject.shortfallpayoutranktext)
      //if (!(myObject.sourcerankassigneddictionary.Count > 1 || myObject.SourceRankDefaultDictionary.Count > 1) ) { //simple case of no rank changes in later years
      //   addLine(" Shortfall Withdrawal Rank", myObject.shortfallpayoutrank.toString());
      //} else {
      //   addLine(" Shortfall Withdrawal Rank", "Varies by year");
      //}
      break

    case F.ACCOUNT_ID:
      // This replaces: var ownerObject = myObject.parent.Parent 1/2/2018
      addLine(" Account's Title", myObject.title)
      addLine(' Owner', myObject.initialowner)
      if (myObject.initialjointowner && myObject.initialjointowner.length > 0 && myObject.initialjointowner !== myObject.initialowner) {
        addLine(' Joint Owner', myObject.initialjointowner)
      }
      if (myObject.startingvalue >= 0) {
        addLine(' Starting Value', accounting.formatNumber(myObject.startingvalue))
      } else {
        //must be -1 = empty
        addLine(' Starting Value', '')
      }
      if (myObject.jointtrustterminating) {
        addLine(' Joint Trust (Terminating)', 'True')
      } else if (myObject.irrevocabletrust) {
        addLine(' Irrevocable Trust', 'True')
      } else {
        addLine(' Normal Account Or Trust', 'True')
      }
      if (myObject.withdrawalsforplanpayoutareunrestricted) {
        addLine(' Withdrawals Are Unrestricted', 'True')
      } else if (myObject.withdrawalsforplanpayoutasspecified) {
        addLine(' Withdrawals Only As Specified', 'True')
      } else if (myObject.withdrawalsforplanpayoutnotallowed) {
        addLine(' Withdrawals Are Not Allowed', 'True')
      } else if (myObject.totalbalanceisspentyearly) {
        addLine(' Total Balance Is Used Up Yearly', 'True')
      }
      if (myObject.taxnormal) {
        addLine(' Tax Normal', 'True')
      } else if (myObject.taxnormaldeferred) {
        addLine(' Tax Normal - Deferred', 'True')
      } else if (myObject.taxexemptfed && myObject.taxexemptstate) {
        addLine(' Tax Exempt Federal And State', 'True')
      } else if (myObject.taxexemptfed) {
        addLine(' Tax Exempt Federal', 'True')
      } else if (myObject.taxexemptstate) {
        addLine(' Tax Exempt State', 'True')
        // } else if (accounting.getPropertyValue(ownerObject.taxnormallongtermrealizedgains, ownerObject.taxnormallongterm)) {
      } else if (accounting.getPropertyValue(myObject.taxnormallongtermrealizedgains, myObject.taxnormallongterm)) {
        addLine(' Tax Normal - Long-Term Capital Gain', 'True')
        if (myObject.realizedgainpercentage !== -1) {
          addLine(' Realized Gain Percentage', accounting.formatPercent(myObject.realizedgainpercentage))
          if (myObject.realizedgaindividendpercentage !== -1) {
            addLine(" Realized Gain's Qualified Dividend Percentage", accounting.formatPercent(myObject.realizedgaindividendpercentage))
          } else {
            addLine(" Realized Gain's Qualified Dividend Percentage", accounting.formatPercent(0))
          }
          if (myObject.realizedgainlongtermpercentage !== -1) {
            addLine(" Realized Gain's Long-Term Percentage", accounting.formatPercent(myObject.realizedgainlongtermpercentage))
          } else {
            addLine(" Realized Gain's Long-Term Percentage", accounting.formatPercent(0))
          }
          if (myObject.realizedgaintaxfreepercentage !== -1) {
            addLine(" Realized Gain's Tax-Free Percentage", accounting.formatPercent(myObject.realizedgaintaxfreepercentage))
          } else {
            addLine(" Realized Gain's Tax-Free Percentage", accounting.formatPercent(0))
          }
          if (myObject.realizedgaintaxnormalpercentage !== -1) {
            addLine(" Realized Gain's Ordinary Income Percentage", accounting.formatPercent(myObject.realizedgaintaxnormalpercentage))
          } else {
            addLine(" Realized Gain's Ordinary Income Percentage", accounting.formatPercent(0))
          }
        } else {
          addLine(' Realized Gain Percentage', accounting.formatPercent(0))
        }
      }

      if (myObject.costbasis !== -1) {
        addLine(' Cost Basis', accounting.formatNumber(myObject.costbasis))
        //} else {
        //    addLine(" Cost Basis", "");
      }

      if (myObject.specificroiforthisaccount !== -1) {
        //special for unspecified
        addLine(' Specific Earnings Percentage Rate', accounting.formatPercent(myObject.specificroiforthisaccount))
        if (myObject.specificsdforthisaccountroi !== -1) {
          addLine(' Specific Earnings Rate Standard Deviation', accounting.formatPercent(myObject.specificsdforthisaccountroi))
        }
      }
      if (myObject.specifictaxrateforthisaccount !== -1) {
        addLine(' Specific Federal Income Tax Rate', accounting.formatPercent(myObject.specifictaxrateforthisaccount))
      }
      if (myObject.specificfedtaxrateforthisaccount !== -1) {
        addLine(' Specific Federal Income Tax Rate', accounting.formatPercent(myObject.specificfedtaxrateforthisaccount))
      }
      if (myObject.specificstatetaxrateforthisaccount !== -1) {
        addLine(' Specific State Income Tax Rate', accounting.formatPercent(myObject.specificstatetaxrateforthisaccount))
      }
      if (myObject.specificlongtermtaxrateforthisaccount !== -1) {
        addLine(' Specific Federal Long-Term Tax Rate', accounting.formatPercent(myObject.specificlongtermtaxrateforthisaccount))
      }
      if (myObject.longtermcapitalgainpercentage > 0) {
        addLine(' % Of Income As Long-term Capital Gain', accounting.formatPercent(myObject.longtermcapitalgainpercentage))
      }
      //if (myObject.marketsimulationassetclassname AndAlso myObject.EnableMarketSim) {
      //    addLine(" Asset Class For Market Performance Simulation", myObject.marketsimulationassetclassname)
      //}
      //if (myObject.decisionrulesassetclassname AndAlso myObject.EnableDecisionRules) {
      //    addLine(" Asset Class For Retirement Withdrawal Rules Simulation", myObject.decisionrulesassetclassname)
      //}
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }

      addLine(' Shortfall Withdrawal Rank', cStr(myObject.shortfallpayoutrank)) //--BCM changed to cStr() call 11/13/17--
      //addLine(" Shortfall Withdrawal Rank", myObject.shortfallpayoutranktext); //--TODO does this exist?--
      //if (Not (SourceRankAssignedDictionary.Count > 1 Or} else { SourceRankDefaultDictionary.Count > 1)) { //simple case of no rank changes in later years
      //   addLine(" Shortfall Withdrawal Rank", ShortfallPayoutRank.toString())
      //} else {
      //   addLine(" Shortfall Withdrawal Rank", "Varies by year")
      //}

      //if (F.Parameters.IsSpecifiedPayoutSequence) {
      //    if (SourceRankAssignedDictionary.Count > 1) {
      //       addLine(" Assigned Shortfall Withdrawal Rank", "Varies by year")
      //    } else {
      //       addLine(" Assigned Shortfall Withdrawal Rank", GetAssetShortfallRankForYear(F.Parameters.PlanPayoutStartYear, Title).toString())
      //    }
      //} else {
      //   if (SourceRankDefaultDictionary.Count > 1) {
      //       addLine(" Default Shortfall Withdrawal Rank", "Varies by year")
      //   } else {
      //       addLine(" Default Shortfall Withdrawal Rank", ShortfallPayoutRank.toString())
      //   }
      //}
      break

    case F.INSURANCE_ID:
      addLine(" Insurance Policy's Title", myObject.title)
      addLine(' Owner', myObject.owner)
      if (myObject.straightlifepolicy) {
        addLine(' Straight Life Policy', 'True')
      } else if (myObject.secondtodiepolicy) {
        addLine(' Second-To-Die Policy', 'True')
      } else if (myObject.variablepolicy) {
        addLine(' Variable Policy', 'True')
      }
      addLine(' Insured Person', myObject.insuredperson)
      if (myObject.secondtodiepolicy) {
        addLine(' Joint Insured Person', myObject.jointinsuredperson)
      }

      addLine(' Benefit Amount', accounting.formatNumber(myObject.benefitamount))
      addLine(' Premium Amount', accounting.formatNumber(myObject.premiumamount))

      if (myObject.variablepolicy) {
        addLine(' Present Cash Value Of Variable Policy', accounting.formatNumber(myObject.startingvalue))
        if (myObject.specificroiforthisaccount !== -1) {
          addLine(' Specific Earnings Percentage Rate:', accounting.formatPercent(myObject.specificroiforthisaccount))
          if (myObject.specificsdforthisaccountroi !== -1) {
            addLine(' Specific Earnings Rate Standard Deviation:', accounting.formatPercent(myObject.specificsdforthisaccountroi))
          }
        }
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      break

    case F.IRA_ID:
      addLine(' IRA or Other Plan Title', myObject.title)
      addLine(' Owner', myObject.owner)
      if (myObject.startingvalue >= 0) {
        addLine(' Starting Value', accounting.formatNumber(myObject.startingvalue))
      } else {
        //must be -1 = empty
        addLine(' Starting Value', '')
      }
      if (!(myObject.rothira || myObject.Normal401kPlan || myObject.Roth401kPlan || myObject.Normal457Plan)) {
        //a traditional IRA
        if (myObject.costbasis > 0) {
          addLine(' Cost Basis', accounting.formatNumber(myObject.costbasis))
        } else {
          addLine(' Cost Basis', '')
        }
        addLine(' This is a traditional IRA account', 'True')
      }
      if (myObject.rothira) {
        addLine(' This is a Roth IRA account', 'True')
      }
      if (myObject.normal401kplan) {
        addLine(' This is a 401(k) account', 'True')
      }
      if (myObject.roth401kplan) {
        addLine(' This is a Roth 401(k) account', 'True')
      }
      if (myObject.normal457plan) {
        addLine(' This is a 457 plan account', 'True')
      }
      if (myObject.specificroiforthisaccount !== -1) {
        addLine(' Specific Earnings Percentage Rate', accounting.formatPercent(myObject.specificroiforthisaccount))
        if (myObject.specificsdforthisaccountroi !== -1) {
          addLine(' Specific Earnings Rate Standard Deviation', accounting.formatPercent(myObject.specificsdforthisaccountroi))
        }
      }

      //if (MarketSimulationAssetClassName && EnableMarketSim) {
      //    addLine(" Asset Class For Market Performance Simulation", MarketSimulationAssetClassName)
      //}
      //if (DecisionRulesAssetClassName && EnableDecisionRules) {
      //    addLine(" Asset Class For Retirement Withdrawal Rules Simulation", DecisionRulesAssetClassName)
      //}
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      addLine(' Shortfall Withdrawal Rank', myObject.shortfallpayoutranktext)
      //if (Not (SourceRankAssignedDictionary.Count > 1 Or} else { SourceRankDefaultDictionary.Count > 1)) { //simple case of no rank changes in later years
      //   addLine(" Shortfall Withdrawal Rank", ShortfallPayoutRank.toString())
      //} else {
      //   addLine(" Shortfall Withdrawal Rank", "Varies by year")
      //}
      break

    case F.PENSION_ID:
      if (myObject.otherincome) {
        addLine(' Other Income Title', myObject.title)
        addLine(' Owner', myObject.owner)
        addLine(' Income Start Year', cStr(myObject.pensionstartyear))
        addLine(' Income Period', cStr(myObject.termcertainperiod))
        addLine(' Income Amount', accounting.formatNumber(myObject.termcertainamount))
      } else {
        addLine(" Pension's Title", myObject.title)
        addLine(' Owner', myObject.owner)
        addLine(' Pension Start Year', cStr(myObject.pensionstartyear))
        if (myObject.termcertainpayoutoption) {
          addLine(' Term Certain Pension Option', 'True')
          addLine(' Term Certain Period', cStr(myObject.termcertainperiod))
          addLine(' Pension Amount', accounting.formatNumber(myObject.termcertainamount))
        } else if (myObject.contingentannuitantpayoutoption) {
          if (myObject.socialsecuritybenefit) {
            addLine(' Social Security Benefit', 'True')
            addLine(' Benefit Amount', accounting.formatNumber(myObject.contingentannuitantlifeannuityamount))
            addLine(' Survivor Benefit Percentage', accounting.formatPercent(myObject.contingentbeneficiarypercentage))
          } else {
            addLine(' Contingent Annuitant Pension Option', 'True')
            addLine(' Pension Amount', accounting.formatNumber(myObject.contingentannuitantlifeannuityamount))
            addLine(' Contingent Beneficiary Percentage', accounting.formatPercent(myObject.contingentbeneficiarypercentage))
          }
        } else {
          //SingleLifeAnnuityAmount is the default
          addLine(' Single Life Pension Option', 'True')
          addLine(' Pension Amount', accounting.formatNumber(myObject.singlelifeannuityamount))
        }
        if (myObject.socialsecuritybenefit) {
          //addLine(" This Is A Social Security Benefit", "True");
          if (myObject.indexrate > 0) {
            addLine(' Index Rate', accounting.formatPercent(myObject.indexrate))
          } else {
            addLine(' Index Rate', "Based On Plan's Global COLA")
          }
          if (myObject.contingentbeneficiarypercentage > 0) {
            addLine(' Index Continues', cStr(myObject.indexcontinues))
          } else {
            if (myObject.indexrate !== -1) {
              //not unspecified
              if (myObject.indexrate > 0) {
                addLine(' Index Rate', accounting.formatPercent(myObject.indexrate))
                if (myObject.contingentbeneficiarypercentage > 0) {
                  addLine(' Index Continues', cStr(myObject.indexcontinues))
                }
              }
            }
          }
          if (myObject.specifictaxrateforthisaccount !== -1) {
            addLine(' Specific Federal Income Tax Rate', accounting.formatPercent(myObject.specifictaxrateforthisaccount))
          }
          if (myObject.specificfedtaxrateforthisaccount !== -1) {
            addLine(' Specific Federal Income Tax Rate', accounting.formatPercent(myObject.specificfedtaxrateforthisaccount))
          }
          if (myObject.specificstatetaxrateforthisaccount !== -1) {
            addLine(' Specific State Income Tax Rate', accounting.formatPercent(myObject.specificstatetaxrateforthisaccount))
          }
          if (myObject.description) {
            addLine(' Description', myObject.description)
          } else {
            addLine(' Description', '')
          }
          break
        }
      }
      break

    case F.PERSON_ID:
      addLine(" Person's Name", myObject.title)

      ////addLine(" Birth Date", String.Format("{0:MMM d yyyy}", BirthDate));
      //var stringDate = Date.parseString(BirthDate);
      // addLine(" Birth Date", dateformat.dateFormat(myObject.birthdate, "mmmm d, yyyy"));

      addLine(' Birth Date', accounting.formatBirthDate(myObject.birthdate))
      addLine(' Age At End Of Life Expectancy', accounting.formatNumber(myObject.lifeexpectancy))
      addLine(' This Person Is A Principal', myObject.isaspouse ? 'True' : 'False')
      if (myObject.isaspouse) {
        addLine(' Is A Source Of Expense Funds', myObject.isasourceofpayoutfunds ? 'True' : 'False')
        addLine(' Is Totally And Permanently Disabled', myObject.isdisabled ? 'True' : 'False')
        addLine(' At Death, Reduce Retirement Expenses By', accounting.formatPercent(myObject.expensesreductionrate === -1 ? 0 : myObject.ExpensesReductionRate))
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      break
    case F.PARAMS_COLLECTION_ID:
      myObject = useChildForData(myObject) //switch objects to get parameter data for this tree leaf
    //NOTE: Falls through to F.PARAMS_ID
    case F.PARAMS_ID:
      //addLine(" Living Expenses (Excluding Taxes) " + vbCrLf + " At Start Of Calculations:", accounting.formatNumber(myObject.planyearlybuyingpower))
      addLine(' Living Expenses (Excluding Taxes) At Start Of Calculations:', accounting.formatNumber(myObject.planyearlybuyingpower))
      addLine(' The Calculation Start Year', myObject.plancalculationstartyear > 0 ? myObject.PlanCalculationStartYear : 'Not Specified')
      addLine(' Retirement Payout Start Year', myObject.planpayoutstartyear ? myObject.PlanPayoutStartYear : 'Not Specified')
      addLine(' Cost Of Living Adjustment Percentage', accounting.formatPercent(myObject.costoflivingadjustment))
      addLine(' Earnings Rate For All Accounts', accounting.formatPercent(myObject.yourestimatedroi))
      addLine(' Effective Federal Tax Rate', accounting.formatPercent(myObject.yourfederaltaxrate))
      if (!quickbuildFormat) {
        addLine(' Effective State Tax Rate', accounting.formatPercent(myObject.yourstatetaxrate))
        //        addLine(" State Of Residence For Probate", YourStateOfResidence
        //addLine(" Tax Relief Act of 2001 Rescinded in " + CStr(TaxAct2001SunsetYear), CStr(TaxAct2001RescindedAtSunsetYear));
        //addLine(" Tax Relief Act of 2003 Rescinded in " + CStr(TaxAct2003SunsetYear), CStr(TaxAct2003RescindedAtSunsetYear));
        if (myObject.surpluspayoutdestinationtitle) {
          addLine(' Surplus Payout Destination Account', myObject.surpluspayoutdestinationtitle)
        } else {
          addLine(' Surplus Payout Destination Account', 'Unspecified')
        }
        //addLine(" Using Default Shortfall Sequence", Boolean(!(myObject.isspecifiedpayoutsequence.toLowerCase())));
        addLine(' Using Default Shortfall Sequence', myObject.isspecifiedpayoutsequence ? 'False' : 'True')
        if (myObject.roisd > 0 || myObject.COLAsd > 0) {
          addLine(' ROI Standard Deviation', accounting.formatPercent(myObject.roisd))
          addLine(' COLA Standard Deviation', accounting.formatPercent(myObject.colasd))
          addLine(' Random Number Seed', cStr(myObject.seed))
          addLine(' Number Of Trials', cStr(myObject.trials))
        }
        if (myObject.description) {
          addLine(" Parameters' Description", myObject.description)
        } else {
          addLine(" Parameters' Description", '')
        }
      }
      break

    case F.ALLPLANRESULTS_ID:
      if (process.env.NODE_ENV === 'development') {
        debugger
      } //developer testing
      break

    case F.MONTECARLORESULTS_ID:
      if (process.env.NODE_ENV === 'development') {
        debugger
      } //developer testing
      break

    case F.BENEFICIARY_ID:
      addLine(' Beneficiary Name', myObject.beneficiaryname)
      //addLine(" Beneficiary Is A Spouse", Spousal ? "True" : "False");
      //if (AllocationPriority > 0) {
      //    addLine(" Beneficiary's Priority", CStr(AllocationPriority))
      //}
      if (myObject.beneficiarypercent > 0) {
        addLine(" Beneficiary's Percentage", accounting.formatPercent(myObject.beneficiarypercent))
      }
      if (myObject.beneficiaryamount > 0) {
        addLine(" Beneficiary's Amount", accounting.formatNumber(myObject.beneficiaryamount))
      }
      if (myObject.sweepbalance) {
        addLine(' Sweep Balance To Pay All Remaining', myObject.sweepbalance ? 'True' : 'False')
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      if (myObject.ignorenow) {
        addLine(' Status', 'Disabled')
      } else {
        addLine(' Status', 'Enabled')
      }
      break

    case F.TRANSFER_ID:
      // This replaces: var ownerObject = myObject.parent.Parent 1/2/2018
      ownerObject = getParent()
      addLine(' Destination Title', myObject.destinationtitle)
      //addLine(" Destination Is A Spousal Account", myObject.spousal ? "True" : "False")
      if (myObject.transferincomeonly) {
        if (accounting.getPropertyValue(ownerObject.TaxNormalLongTermRealizedGains, ownerObject.TaxNormalLongTerm)) {
          addLine(' Transfer Realized Gain', myObject.transferincomeonly ? 'True' : 'False')
        } else {
          addLine(' Transfer Income Only', myObject.transferincomeonly ? 'True' : 'False')
        }
      }
      if (myObject.sweepbalance) {
        addLine(' Sweep Balance To Withdraw All Remaining', myObject.sweepbalance ? 'True' : 'False')
      }
      //if (myObject.allocationpriority > 0) {
      //    addLine(" Transfer Priority", CStr(myObject.allocationpriority))
      //}
      if (myObject.transferpercent > 0) {
        addLine(' Transfer Percentage', accounting.formatPercent(myObject.transferpercent))
      }
      if (myObject.transferwithdrawalamount > 0) {
        addLine(' Transfer Withdrawal Amount', accounting.formatNumber(myObject.transferwithdrawalamount))
      }
      if (myObject.transferdeliveryamount > 0) {
        addLine(' Transfer Delivery Amount', accounting.formatNumber(myObject.transferdeliveryamount))
      }
      if (myObject.transferstartyear > 0) {
        addLine(' Transfer Start Year', cStr(myObject.transferstartyear))
      }
      if (myObject.transferperiodyears > 0) {
        addLine(' Transfer Duration Years', cStr(myObject.transferperiodyears))
      }
      if (myObject.instructioncycleyears > 0) {
        addLine(' Transfer Cycle Years', cStr(myObject.instructioncycleyears))
      }
      if (myObject.distributionfromira && myObject.distributionhasnopenaltytax) {
        addLine(' Special Early Distribution With No Penalty Tax', myObject.distributionhasnopenaltytax ? 'True' : 'False')
      }
      if (myObject.indexrate > 0) {
        addLine(' Index Rate', accounting.formatPercent(myObject.indexrate))
      }
      if (myObject.dotransferbeforeearningscalc) {
        addLine(" Transfer Before Year's Earnings Are Calculated", myObject.dotransferbeforeearningscalc ? 'True' : 'False')
      }
      if (myObject.distributionfromira) {
        if (!(ownerObject.RothIRA || ownerObject.Roth401kPlan || ownerObject.Normal457Plan)) {
          if (myObject.irataxfromothersourceoption) {
            comment = ' Pay from outside source, no accounts reduced.'
          } else {
            if (myObject.irataxfromirafundsoption || !(myObject.IRATaxFromOtherSourceOption || myObject.IRATaxFromIRAFundsOption || myObject.IRATaxFromSelectedAccountOption)) {
              comment = ' Pay from distributed amount.'
            } else if (myObject.irataxfromselectedaccountoption) {
              comment = ' Pay from account: ' + myObject.irataxsourcetitle
            }
            if (myObject.irataxspecifiedtaxrate > 0) {
              comment += ' at rate = ' + accounting.formatPercent(myObject.irataxspecifiedtaxrate)
            }
          }
          if (comment) {
            addLine('If Any Distribution Income Tax Due', comment)
          }
        }
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      if (myObject.ignorenow) {
        addLine(' Status', 'Disabled')
      } else {
        addLine(' Status', 'Enabled')
      }
      break

    case F.DEPOSIT_ID:
      // This replaces: var ownerObject = myObject.parent.Parent 1/2/2018
      ownerObject = getParent()
      var possibleCostBasisIncrease
      addLine(' Deposit Amount', accounting.formatNumber(myObject.depositamount))
      if (myObject.depositstartyear > 0) {
        addLine(' Deposit Start Year', cStr(myObject.depositstartyear))
      }
      if (myObject.depositperiodyears > 0) {
        addLine(' Deposit Duration Years', cStr(myObject.depositperiodyears))
      }
      if (myObject.instructioncycleyears > 0) {
        addLine(' Deposit Cycle Years', cStr(myObject.instructioncycleyears))
      }

      possibleCostBasisIncrease = ownerObject.objecttype === F.IRA_ID && !(ownerObject.RothIRA || ownerObject.Roth401kPlan || ownerObject.Normal457Plan)
      if (possibleCostBasisIncrease) {
        addLine(' Adds To Cost Basis', myObject.depositaddstocostbasis ? 'True' : 'False')
      }
      if (myObject.indexrate > 0) {
        addLine(' Index Rate', accounting.formatPercent(myObject.indexrate))
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      if (myObject.ignorenow) {
        addLine(' Status', 'Disabled')
      } else {
        addLine(' Status', 'Enabled')
      }
      break

    //case F.PAYIN_ID:
    case F.COST_ID:
      addLine(' Amount Of Cost', accounting.formatNumber(myObject.costamount))
      if (myObject.coststartyear > 0) {
        addLine(' Start Year Of Cost', cStr(myObject.coststartyear))
      }
      if (myObject.costperiodyears > 0) {
        addLine(' Cost Duration Years', cStr(myObject.costperiodyears))
      }
      if (myObject.instructioncycleyears > 0) {
        addLine(' Cost Cycle Years', cStr(myObject.instructioncycleyears))
      }
      if (myObject.indexrate > 0) {
        addLine(' Index Rate', accounting.formatPercent(myObject.indexrate))
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      if (myObject.ignorenow) {
        addLine(' Status', 'Disabled')
      } else {
        addLine(' Status', 'Enabled')
      }
      break

    //case F.WITHDRAWAL_ID:
    case F.PAYOUT_ID:
      // This replaces: var ownerObject = myObject.parent.Parent 1/2/2018
      ownerObject = getParent()
      if (myObject.payoutamount > 0) {
        addLine(' Withdrawal Amount', accounting.formatNumber(myObject.payoutamount))
      }
      if (myObject.payoutincomeonly) {
        if (accounting.getPropertyValue(ownerObject.TaxNormalLongTermRealizedGains, ownerObject.TaxNormalLongTerm)) {
          addLine(' Withdraw Realized Gain', cStr(myObject.payoutincomeonly))
        } else {
          addLine(' Withdraw Income Only', cStr(myObject.payoutincomeonly))
        }
      }
      if (myObject.sweepbalance) {
        addLine(' Sweep Balance To Take All Remaining', myObject.sweepbalance ? 'True' : 'False')
      }
      if (myObject.payoutpercent > 0) {
        addLine(' Withdrawal Percentage', accounting.formatPercent(myObject.payoutpercent))
      }
      if (myObject.payoutstartyear > 0) {
        addLine(' Withdrawal Start Year', cStr(myObject.payoutstartyear))
      }
      if (myObject.payoutperiodyears > 0) {
        addLine(' Withdrawal Duration Years', cStr(myObject.payoutperiodyears))
      }
      if (myObject.instructioncycleyears > 0) {
        addLine(' Withdrawal Cycle Years', cStr(myObject.instructioncycleyears))
      }
      if (myObject.distributionfromira) {
        addLine(' Special Early Distribution With No Penalty Tax', cStr(myObject.distributionhasnopenaltytax))
      }
      if (myObject.indexrate > 0) {
        addLine(' Index Rate', accounting.formatPercent(myObject.indexrate))
      }
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      if (myObject.ignorenow) {
        addLine(' Status', 'Disabled')
      } else {
        addLine(' Status', 'Enabled')
      }
      break

    case F.PARAMETERCHANGE_ID:
      // This replaces: var ownerObject = myObject.parent.Parent 1/2/2018
      ownerObject = getParent()
      var globalParams = false
      var changeRoi = false
      if (ownerObject.objecttype === F.PARAMS_ID) {
        globalParams = true //set flag for logic below
        changeRoi = true //set flag for logic below
      }
      if (ownerObject.objecttype === F.PARAMETERCHANGE_COLLECTION_ID) {
        changeRoi = true //set flag for logic below
      }
      if (ownerObject.objecttype === F.ANNUITY_ID) {
        changeRoi = true //set flag for logic below
      }
      if (ownerObject.objecttype === F.ACCOUNT_ID) {
        changeRoi = true //set flag for logic below
      }
      if (ownerObject.objecttype === F.INSURANCE_ID) {
        changeRoi = true //set flag for logic below
      }
      if (ownerObject.objecttype === F.IRA_ID) {
        changeRoi = true //set flag for logic below
      }
      if (myObject.parmchangeeffectiveyear > 0) {
        addLine(' Effective Year', cStr(myObject.parmchangeeffectiveyear))
      }
      if (changeRoi) {
        //relevant for this asset
        if (myObject.parmchangeearningsrate >= 0) {
          addLine(' Earnings Rate', accounting.formatPercent(myObject.parmchangeearningsrate))
        } else {
          addLine(' Earnings Rate', '-')
        }
      }
      if (myObject.parmchangefederalincometax >= 0) {
        addLine(' Federal Income Tax', accounting.formatPercent(myObject.parmchangefederalincometax))
      } else {
        addLine(' Federal Income Tax', '-')
      }
      if (myObject.parmchangestateincometax >= 0) {
        addLine(' State Income Tax', accounting.formatPercent(myObject.parmchangestateincometax))
      } else {
        addLine(' State Income Tax', '-')
      }
      if (changeRoi) {
        //relevant for this asset
        if (myObject.parmchangecapitalgainstax >= 0) {
          addLine(' Capital Gains Tax', accounting.formatPercent(myObject.parmchangecapitalgainstax))
        } else {
          addLine(' Capital Gains Tax', '-')
        }
      }
      if (globalParams) {
        //relevant for the plan globally
        if (myObject.parmchangeinflationrate >= 0) {
          addLine(' Inflation Rate', accounting.formatPercent(myObject.parmchangeinflationrate))
        } else {
          addLine(' Inflation Rate', '-')
        }

        if (myObject.parmchangelivingexpensechangefactor >= 0) {
          //can range from low like .05 to high like 1.95
          if (myObject.parmchangelivingexpensechangefactor >= 1) {
            addLine(' Living Expense Change Percent', accounting.formatPercent(myObject.parmchangelivingexpensechangefactor - 1))
          } else {
            addLine(' Living Expense Change Percent', '-' + accounting.formatPercent(1 - myObject.parmchangelivingexpensechangefactor))
          }
        } else if (myObject.parmchangelivingexpensespecified !== -1) {
          //special property - negative values besides -1 are allowed
          if (myObject.parmchangelivingexpensespecified > 0) {
            addLine(' Living Expense Change Amount', '+' + accounting.formatNumber(myObject.parmchangelivingexpensespecified))
          } else if (myObject.parmchangelivingexpensespecified < 0) {
            addLine(' Living Expense Change Amount', accounting.formatNumber(myObject.parmchangelivingexpensespecified))
          }
        } else {
          addLine(' Living Expense Change', '-')
        }

        if (myObject.parmchangeindividualyearlygifttaxexclusion >= 0) {
          addLine(' Individual Yearly Gift Tax Exclusion', accounting.formatNumber(myObject.parmchangeindividualyearlygifttaxexclusion))
        } else {
          addLine(' Individual Yearly Gift Tax Exclusion', '-')
        }
        //if (myObject.parmchangelifetimegifttaxexclusion >= 0) {
        //    addLine(" Life Time Gift Tax Exclusion", accounting.formatNumber(myObject.parmchangelifetimegifttaxexclusion))
        //} else {
        //    addLine(" Life Time Gift Tax Exclusion", "-")
        //}
      }
      //if (myObject.parmchangereset) {
      //    addLine(" Reset All Earlier Parameter Changes", CStr(myObject.parmchangereset))
      //}
      if (myObject.description) {
        addLine(' Description', myObject.description)
      } else {
        addLine(' Description', '')
      }
      if (myObject.ignorenow) {
        addLine(' Status', 'Disabled')
      } else {
        addLine(' Status', 'Enabled')
      }
      break

    case F.ACCOUNT_COLLECTION_ID:
      addLine(' Number of Normal Taxable Accounts', cStr(collectionCount(myObject)))
      break
    case F.ANNUITY_COLLECTION_ID:
      addLine(' Number of Annuities', cStr(collectionCount(myObject)))
      break
    case F.INSURANCE_COLLECTION_ID:
      addLine(' Number of Insurances', cStr(collectionCount(myObject)))
      break
    case F.IRA_COLLECTION_ID:
      addLine(' Number of IRAs & Other Deferred Plans', cStr(collectionCount(myObject)))
      break
    case F.PENSION_COLLECTION_ID:
      addLine(' Number of Pensions & Other Incomes', cStr(collectionCount(myObject)))
      break
    case F.PERSON_COLLECTION_ID:
      addLine(' Number of Persons', cStr(collectionCount(myObject)))
      break

    case F.BENEFICIARY_COLLECTION_ID:
      addLine(' Number of Beneficiaries', cStr(collectionCount(myObject)))
      break
    case F.TRANSFER_COLLECTION_ID:
      addLine(' Number of Transfers', cStr(collectionCount(myObject)))
      break
    case F.DEPOSIT_COLLECTION_ID:
      addLine(' Number of Deposits', cStr(collectionCount(myObject)))
      break
    // case F.WITHDRAWALS_COLLECTION_ID:
    case F.PAYOUT_COLLECTION_ID:
      addLine(' Number of Withdrawals', cStr(collectionCount(myObject)))
      break
    //case F.PAYIN_COLLECTION_ID:
    case F.COST_COLLECTION_ID:
      addLine(' Number of Costs', cStr(collectionCount(myObject)))
      break
    case F.PARAMETERCHANGE_COLLECTION_ID:
      addLine(' Number of Parameter Changes', cStr(collectionCount(myObject)))
      break
    default:
      if (process.env.NODE_ENV === 'development') {
        debugger
      } //developer testing for missing case
  } //End Select

  return planDataArray
}
// GetSelectedData.propTypes = {
//   myObject: PropTypes.object.isRequired,
//   targetPath: PropTypes.string.isRequired,
//   planObject: PropTypes.object.isRequired,
//   quickbuildFormat: PropTypes.quickbuildFormat,
// }
export default getSelectedData
