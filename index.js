import express from 'express'
import axios from 'axios'

async function askGpt(prompt) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const now = new Date();
  const day = days[now.getUTCDay()];
  const date = now.getUTCDate();
  const month = months[now.getUTCMonth()];
  const year = now.getUTCFullYear();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  const formattedDate = `${day}, ${month} ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`;
  
  
    let res = await axios({
      method: "POST",
      url: "https://omniplex.ai/api/chat",
      data: {
        "frequency_penalty": 0,
        "max_tokens": 2048,
        "messages": [
    { "role": "system", "content": `You are a helpful assistant` //Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided web Search Results (URL and Summary).You must only use information from the provided search results.Use an unbiased and journalistic tone.Use this current date and time: ${formattedDate}. Combine search results together into a coherent answer.Do not repeat text. Cite search results using [{number}] notation.Only cite the most relevant results that answer the question accurately.If different results refer to different entities with the same name, write separate answers for each entity.You have the ability to search and will be given websites and the scarped data from them and you will have to make up an answer with that onlyYou must must provide citations in the format of [{number}] and it sharts with [{1}].
    },
    { role: "user", content: prompt }
    ],
    "model": "gpt-4o",
    "presence_penalty": 0,
    "temperature": 1,
    "top_p": 1
      },
      headers: {
        // "User-Agent": "okhttp/4.9.0",
        "Referer": "https://omniplex.ai/",
        "Origin": "https://omniplex.ai"
      }
    })
    
    return res.data
  }

const app = express()
const port = 2681

app.get('/', (req, res) => {
  res.send('hakim gembel!')
})

app.all('/chatgpt', async(req, res) => {
    const {query} = req.query
    if(!query) {
        return res.send("Tidak ada query, gunakan link ?query=<teks>")
    }
    res.send(await askGpt(query))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
