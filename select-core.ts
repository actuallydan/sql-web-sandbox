const completeStateTree = {
    "__ignore__RULES__": ["top level properties refer to queries or subqueries", "queries that contain a \"\" note queries that can be the start of a sequence. If the segment option does not include a \"\" property, then it cannot start a statement"],
    "select-core": {
        "": [
            "SELECT",
            "VALUES"
        ],
        "SELECT": [
            "result-column",
            "DISTINCT",
            "ALL"
        ],
        "DISTINCT": [
            "result-column"
        ],
        "ALL": [
            "result-column"
        ],
        "result-column_,": [
            "result-column"
        ],
        "result-column": [
            "result-column_,",
            "FROM"
        ],
        "FROM": [
            "table-or-subquery",
            "join-clause"
        ],
        "WHERE": [
            "WHERE_expr"
        ],
        "WHERE_expr": ["GROUP BY", "HAVING", "WINDOW", ";"],
        "GROUP BY": ["GROUP BY_expr"],
        "GROUP BY_expr": ["HAVING", "GROUP BY_expr_,", ";"],
        "GROUP BY_expr_,": ["GROUP BY_expr"],
        "HAVING": ["HAVING_expr"],
        "HAVING_expr": ["WINDOW", ";"],
        "WINDOW": ["window-name"],
        "VALUES": [
            "VALUES_("
        ],
        "VALUES_(": [
            "VALUES_expr"
        ],
        "VALUES_expr_)": [
            ";",
            "VALUES_expr_)_,"
        ],
        "VALUES_expr": [
            "VALUES_expr_)"
        ],
        "VALUES_expr_)_,": [
            "VALUES_("
        ],
        "window-name": ["window-name_AS"],
        "window-name_AS": ["window-defn"],
        "window-defn": ["window-name_AS_window-defn_,", ";"],
        "window-name_AS_window-defn_,": ["window_name"],
        "table-or-subquery": [
            "table-or-subquery_,",
            "WHERE"
        ],
        "table-or-subquery_,": [
            "table-or-subquery"
        ],
        "join-clause": ["WHERE"],
        ";": ["END"]
    },
    "filter-clause": {
        "FILTER": [
            "("
        ],
        "(": [
            "WHERE"
        ],
        "WHERE": [
            "expr"
        ],
        "expr": ")",
        ")": ["END"]
    }
}


const stateTree = completeStateTree["select-core"];


function createMachine() {
    let state = "";
    return {
        state,
        getNextStates: function () {
            // Check if the current state exists in the state tree
            if (!stateTree[state]) {
                throw new Error(`State "${state}" not found in the state tree.`);
            }

            // Based on the current state, return the possible subsequent states
            console.log("getNextStates: ", stateTree[state])
            return stateTree[state];
        },
        getState: function(){
            console.log("getState: ", state)
            return state;
        },
        updateState: function (str) {
            const lastStmt = str.split(" ").filter(Boolean)?.at(-1);

            if(!lastStmt){
                return;
            }
            
            console.log("updateState: ", lastStmt)
            const validNextStates = this.getNextStates();

            console.log("updateState: validNextStates: ", validNextStates)

            // if the user is clearly in a valid subsequent state, set the new state
            if (validNextStates.includes(lastStmt.toUpperCase())) {
                console.log("updateState: exact match, setting state to " + lastStmt.toUpperCase())
                state = lastStmt.toUpperCase();
                return;
            }

            // if the statement text matches the exact text from the last segement of one of the options
            const validSubStrings = validNextStates.map(n => n.split("_").at(-1).toUpperCase());
            let index = validSubStrings.indexOf(lastStmt.toUpperCase());

            if(index > -1){
                console.log("updateState: substring match, setting state to " + validNextStates[index])
                state = validNextStates[index];
                return;
            }

            // if the statement doesn't exactly match any keywords and it's the only remaining option, set the state
            const possibleSubStatements = validNextStates.filter((selectOption) => {
                return !keywordsMap[selectOption.toLowerCase()];
            });

            console.log("updateState: possible sub statements: ", possibleSubStatements)

            if (possibleSubStatements.length === 1) {
                console.log("updateState: setting state to " + possibleSubStatements[0])
                state = possibleSubStatements[0];
                return;
            }

            console.log("nothing to update yet")
            // if(possibleSubStatements.length > 1){
            // 	// add current state to stack and set state to sub-statement state
            // }
        },
    };
}

export const keywords = [
    "abort",
    "action",
    "add",
    "after",
    "all",
    "alter",
    "always",
    "analyze",
    "and",
    "as",
    "asc",
    "attach",
    "autoincrement",
    "before",
    "begin",
    "between",
    "by",
    "cascade",
    "case",
    "cast",
    "check",
    "collate",
    "column",
    "commit",
    "count",
    "conflict",
    "constraint",
    "create",
    "cross",
    "current",
    "current_date",
    "current_time",
    "current_timestamp",
    "database",
    "default",
    "deferrable",
    "deferred",
    "delete",
    "desc",
    "detach",
    "distinct",
    "do",
    "drop",
    "each",
    "else",
    "end",
    "escape",
    "except",
    "exclude",
    "exclusive",
    "exists",
    "explain",
    "fail",
    "filter",
    "first",
    "following",
    "for",
    "foreign",
    "from",
    "full",
    "generated",
    "glob",
    "group",
    "groups",
    "having",
    "if",
    "ignore",
    "immediate",
    "in",
    "index",
    "indexed",
    "initially",
    "inner",
    "insert",
    "instead",
    "intersect",
    "into",
    "is",
    "isnull",
    "join",
    "key",
    "last",
    "left",
    "like",
    "limit",
    "match",
    "materialized",
    "natural",
    "no",
    "not",
    "nothing",
    "notnull",
    "null",
    "nulls",
    "of",
    "offset",
    "on",
    "or",
    "order",
    "others",
    "outer",
    "over",
    "partition",
    "plan",
    "pragma",
    "preceding",
    "primary",
    "query",
    "raise",
    "range",
    "recursive",
    "references",
    "regexp",
    "reindex",
    "release",
    "rename",
    "replace",
    "restrict",
    "returning",
    "right",
    "rollback",
    "row",
    "rows",
    "savepoint",
    "select",
    "set",
    "table",
    "temp",
    "temporary",
    "then",
    "ties",
    "to",
    "transaction",
    "trigger",
    "unbounded",
    "union",
    "unique",
    "update",
    "using",
    "vacuum",
    "values",
    "view",
    "virtual",
    "when",
    "where",
    "window",
    "with",
    "without",
];

export const keywordsMap = keywords.reduce(
    (agg: Record<string, string>, it: string) => {
        agg[it] = it;
        return agg;
    },
    {}
);

const machine = createMachine();

machine.getNextStates()

machine.updateState("SELECT")
machine.getNextStates()

machine.updateState("SELECT *")
machine.getNextStates()
machine.getState()
machine.updateState("SELECT * FRO")
machine.getState()

