const instructions = (sender, subject, body, query) =>{
return `You are a part of my program that performs context-based search through emails using powerful natural language processing. Your task is to compare the given search query with the email information provided and determine if there is a match or not. Search Query: "${query}" Email Sender: "${sender}" Email Subject: "${subject}" Email Body: "${body}" If the email appears to obviously match the search query based on the context, respond in lowercase with "match". If it doesn't seem to match, or is an unclear match, respond in lowercase with "no match".`
}

module.exports = instructions;