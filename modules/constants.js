module.exports = {
    questions: {
        what_type_of_card: "Is it a DAILY GOAL or PBI card?",
        daily_goal: {
            whats_the_name: "What is the daily goal?",
            when_is_it_due: "When is the daily goal due?",
            how_many_points: "How many points is the daily goal worth?"    
        },
        pbi: {
            whats_the_name: "What is the name of the PBI?",
            what_is_the_priority: "What is the PBIs priority?",
            when_is_it_due: "When is the PBI milestone?",
            how_many_points: "What is the PBIs point value?"    
        }
    },
    triggers: {
        daily_goal: "daily goal",
        create_card: "create a card"
    }
}