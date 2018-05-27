export function planException(e) {
    "use strict";
        // Recover this exception object from a catch(e) statement
        var stack = [];
        if (e.stack) { stack = e.stack.split("\n"); }
        var extra = e.extra || null; //added by the function
        var name = e.name || null;
        var nmbr = e.number || null;
        var desc = (typeof e === "string" ? e : null);
        // var message = "A message from MoneyPlanException(e). ";
        var message = "A message from MoneyPlan. ";
        message += "An error occurred. ";
        if (name) { message += " Name: " + name + ". "; }
        if (nmbr) { message += " Nmbr: " + nmbr + ". "; }
        if (desc) { message += " Desc: " + desc + ". "; }
        if (extra) { message += " Extra: " + extra + ". "; }
        // + ", " + e.name + ": "
        // + (e.description || e.message) + "\n "
        message += stack.join("\n");
        // message += stack[0] + "\n" + stack[1];
        console.log(message);

        if (SESSION.localhost) {debugger};  //pause for developer inspection
        return; //use step-over to go back to origin
}