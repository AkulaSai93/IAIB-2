/* The code samples. `raw` is what the Copy button puts on the clipboard; `html`
   is the highlighted version, one entry per rendered line. Hand-tokenised rather
   than pulling in a highlighter for four fixed snippets. */

export type SnippetKey = "py" | "js" | "pr" | "sh";

export const TABS: { key: SnippetKey; label: string }[] = [
  { key: "py", label: "tutor.py" },
  { key: "js", label: "tutor.js" },
  { key: "pr", label: "prompt.md" },
  { key: "sh", label: "terminal" },
];

export const SNIPPETS: Record<SnippetKey, { raw: string; html: string[] }> = {
  py: {
    raw: `# session 03 · your first model call
import anthropic

client = anthropic.Anthropic()

reply = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=600,
    system="You are a patient tutor for class 9.",
    messages=[
        {"role": "user", "content": "Explain photosynthesis, then quiz me."}
    ],
)

print(reply.content[0].text)`,
    html: [
      '<span class="c"># session 03 · your first model call</span>',
      '<span class="k">import</span> <span class="v">anthropic</span>',
      "",
      '<span class="v">client</span> <span class="p">=</span> <span class="v">anthropic</span><span class="p">.</span><span class="f">Anthropic</span><span class="p">()</span>',
      "",
      '<span class="v">reply</span> <span class="p">=</span> <span class="v">client</span><span class="p">.</span><span class="v">messages</span><span class="p">.</span><span class="f">create</span><span class="p">(</span>',
      '    <span class="v">model</span><span class="p">=</span><span class="s">"claude-sonnet-4-5"</span><span class="p">,</span>',
      '    <span class="v">max_tokens</span><span class="p">=</span><span class="n">600</span><span class="p">,</span>',
      '    <span class="v">system</span><span class="p">=</span><span class="s">"You are a patient tutor for class 9."</span><span class="p">,</span>',
      '    <span class="v">messages</span><span class="p">=[</span>',
      '        <span class="p">{</span><span class="s">"role"</span><span class="p">:</span> <span class="s">"user"</span><span class="p">,</span> <span class="s">"content"</span><span class="p">:</span> <span class="s">"Explain photosynthesis, then quiz me."</span><span class="p">}</span>',
      '    <span class="p">],</span>',
      '<span class="p">)</span>',
      "",
      '<span class="f">print</span><span class="p">(</span><span class="v">reply</span><span class="p">.</span><span class="v">content</span><span class="p">[</span><span class="n">0</span><span class="p">].</span><span class="v">text</span><span class="p">)</span>',
    ],
  },
  js: {
    raw: `// session 03 · your first model call
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const reply = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 600,
  system: "You are a patient tutor for class 9.",
  messages: [
    { role: "user", content: "Explain photosynthesis, then quiz me." },
  ],
});

console.log(reply.content[0].text);`,
    html: [
      '<span class="c">// session 03 · your first model call</span>',
      '<span class="k">import</span> <span class="v">Anthropic</span> <span class="k">from</span> <span class="s">"@anthropic-ai/sdk"</span><span class="p">;</span>',
      "",
      '<span class="k">const</span> <span class="v">client</span> <span class="p">=</span> <span class="k">new</span> <span class="f">Anthropic</span><span class="p">();</span>',
      "",
      '<span class="k">const</span> <span class="v">reply</span> <span class="p">=</span> <span class="k">await</span> <span class="v">client</span><span class="p">.</span><span class="v">messages</span><span class="p">.</span><span class="f">create</span><span class="p">({</span>',
      '  <span class="v">model</span><span class="p">:</span> <span class="s">"claude-sonnet-4-5"</span><span class="p">,</span>',
      '  <span class="v">max_tokens</span><span class="p">:</span> <span class="n">600</span><span class="p">,</span>',
      '  <span class="v">system</span><span class="p">:</span> <span class="s">"You are a patient tutor for class 9."</span><span class="p">,</span>',
      '  <span class="v">messages</span><span class="p">:</span> <span class="p">[</span>',
      '    <span class="p">{</span> <span class="v">role</span><span class="p">:</span> <span class="s">"user"</span><span class="p">,</span> <span class="v">content</span><span class="p">:</span> <span class="s">"Explain photosynthesis, then quiz me."</span> <span class="p">},</span>',
      '  <span class="p">],</span>',
      '<span class="p">});</span>',
      "",
      '<span class="v">console</span><span class="p">.</span><span class="f">log</span><span class="p">(</span><span class="v">reply</span><span class="p">.</span><span class="v">content</span><span class="p">[</span><span class="n">0</span><span class="p">].</span><span class="v">text</span><span class="p">);</span>',
    ],
  },
  pr: {
    raw: `# Study buddy

You are a patient tutor for a class 9 student in India.

1. Explain photosynthesis in plain language.
2. Use one example from a kitchen garden.
3. Then ask me three questions, one at a time.
4. After each answer, tell me exactly where I went wrong.

Do not give me the answer before I try.`,
    html: [
      '<span class="k"># Study buddy</span>',
      "",
      '<span class="v">You are a patient tutor for a class 9 student in India.</span>',
      "",
      '<span class="n">1.</span> <span class="v">Explain photosynthesis in plain language.</span>',
      '<span class="n">2.</span> <span class="v">Use one example from a kitchen garden.</span>',
      '<span class="n">3.</span> <span class="v">Then ask me three questions, one at a time.</span>',
      '<span class="n">4.</span> <span class="v">After each answer, tell me exactly where I went wrong.</span>',
      "",
      '<span class="c">Do not give me the answer before I try.</span>',
    ],
  },
  sh: {
    raw: `$ pip install anthropic
$ export ANTHROPIC_API_KEY=your-key-here
$ python tutor.py

Photosynthesis is how a plant makes its own food...

Question 1 of 3: which part of the leaf traps sunlight?`,
    html: [
      '<span class="k">$</span> <span class="v">pip install anthropic</span>',
      '<span class="k">$</span> <span class="v">export ANTHROPIC_API_KEY=your-key-here</span>',
      '<span class="k">$</span> <span class="v">python tutor.py</span>',
      "",
      '<span class="c">Photosynthesis is how a plant makes its own food...</span>',
      "",
      '<span class="s">Question 1 of 3: which part of the leaf traps sunlight?</span>',
    ],
  },
};
