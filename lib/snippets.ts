import { Model } from "./types";

export function generateSnippets(model: Model) {
    return {
        curl: `curl https://api.${model.provider.toLowerCase()}.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{
    "model": "${model.api_string}",
    "messages": [
      {
        "role": "user",
        "content": "Hello, world!"
      }
    ]
  }'`,
        python: `import os
from ${model.provider.toLowerCase()} import ${model.provider}Client

client = ${model.provider}Client(
    api_key=os.environ.get("${model.provider.toUpperCase()}_API_KEY"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Hello, world!",
        }
    ],
    model="${model.api_string}",
)

print(chat_completion.choices[0].message.content)`,
        javascript: `import { ${model.provider} } from "${model.provider.toLowerCase()}";

const client = new ${model.provider}();

async function main() {
  const completion = await client.chat.completions.create({
    messages: [{ role: "user", content: "Hello, world!" }],
    model: "${model.api_string}",
  });

  console.log(completion.choices[0].message.content);
}

main();`
    };
}
