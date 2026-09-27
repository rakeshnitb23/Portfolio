import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Manual",
  description:
    "How to work with me effectively. I'm learning to delegate more so I can focus on high-leverage work.",
  alternates: { canonical: "/user-manual" },
};

export default function UserManualPage() {
  return (
    <div className="max-w-none py-10">
      <h1 id="user-manual" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-6">
        User Manual
      </h1>

      <div className="prose-content">
        <p>
          How to work with me effectively. I&apos;m learning to delegate more so I
          can focus on high-leverage work.
        </p>
        <hr />

        <h2 id="what-i-value">What I Value</h2>
        <ul>
          <li>
            <strong>Constant learning and growth</strong> - I&apos;m driven by the
            need to learn continuously. I expect the same from my team.
          </li>
          <li>
            <strong>Move fast and break things</strong> - Execute fast. If
            you&apos;re wrong, we can fix it later. Don&apos;t wait for approval.
          </li>
          <li>
            <strong>Asynchronous communication</strong> - I prefer async. If you
            message me, assume I have 5 minutes to process and respond.
          </li>
          <li>
            <strong>Direct communication</strong> - Keep it yes/no or
            number-based. Be brief. Don&apos;t bury important information.
          </li>
          <li>
            <strong>Health first</strong> - I have a hand injury. I prefer
            face-to-face or video feedback over typing.
          </li>
          <li>
            <strong>Take ownership</strong> - If the task is hard, I probably
            didn&apos;t give enough details. Ask for what you need.
          </li>
          <li>
            <strong>Simplicity</strong> - I hate unearned complexity. If I see a
            flowchart with 12 things, I lose my mind.
          </li>
        </ul>
        <hr />

        <h2 id="pet-peeves">Pet Peeves</h2>
        <ul>
          <li>
            <strong>Silence</strong> - Not getting updates makes me anxious.
            &quot;Working on this&quot; or &quot;I&apos;m blocked here&quot; are
            good messages.
          </li>
          <li>
            <strong>Context switching</strong> - Remind me where things are when
            you update me. Assume I read but don&apos;t remember.
          </li>
          <li>
            <strong>Lack of feedback</strong> - I need critical feedback
            regularly. If you&apos;re not telling me what could be better, it
            holds us both back.
          </li>
        </ul>
        <hr />

        <h2 id="how-to-communicate">How to Communicate</h2>
        <p>
          <strong>Use async first.</strong> Slack or text messages work best.
          Keep it brief with bullet points.
        </p>
        <p>
          <strong>I&apos;m often mobile.</strong> Messages should be structured
          for quick skimming. Put key info at the top.
        </p>
        <p>
          <strong>Ask specific questions.</strong> Frame questions so they can be
          answered with yes/no or numbers. &quot;How can I help?&quot; beats
          &quot;Do you think I should work on X?&quot;
        </p>
        <p>
          <strong>Prep me for meetings.</strong> Send materials before to reset
          my focus. Follow up with summary and action items.
        </p>
        <hr />

        <h2 id="how-to-message-me">How to Message Me</h2>
        <p>
          Message me on Slack. If urgent, text me. Assume I&apos;m opening your
          message on my Apple Watch. No links, short messages.
        </p>
        <p>
          <strong>Good practices:</strong>
        </p>
        <ul>
          <li>
            <p>
              <strong>Clear subject lines</strong> - Make the topic immediately
              apparent
            </p>
            <ul>
              <li>Good: &quot;Urgent: Client proposal needs approval by 3pm&quot;</li>
              <li>Bad: &quot;Quick question&quot;</li>
            </ul>
          </li>
          <li>
            <p>
              <strong>Structure for quick decisions</strong> - Present numbered
              options
            </p>
            <ul>
              <li>
                Good: &quot;Logo options: 1. Blue 2. Green 3. Red. Which? Default
                to{" "}
                <a
                  href="https://github.com/jxnl/instructor/issues/1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #1
                </a>{" "}
                if no response by EOD.&quot;
              </li>
              <li>Bad: &quot;What color should we use?&quot;</li>
            </ul>
          </li>
          <li>
            <p>
              <strong>Flag time-sensitive items</strong> - Use [Urgent],
              [Time-sensitive], or [FYI] prefixes
            </p>
          </li>
          <li>
            <p>
              <strong>Use visuals</strong> - Screenshots convey information
              faster than text
            </p>
            <ul>
              <li>Good: &quot;New dashboard layout: [screenshot]. Thoughts?&quot;</li>
              <li>Bad: Long description of layout changes</li>
            </ul>
          </li>
          <li>
            <p>
              <strong>End with clear next step</strong> - What action do you
              need from me?
            </p>
          </li>
          <li>
            <p>
              <strong>Keep it short</strong> - Put the ask at the top with clear
              call to action
            </p>
          </li>
          <li>
            <p>
              <strong>Ask forgiveness, not permission</strong> - &quot;I&apos;m
              going to do this, let me know if wrong&quot; beats &quot;What do
              you think about this?&quot;
            </p>
          </li>
        </ul>
        <hr />

        <h2 id="how-i-prioritize">How I Prioritize</h2>
        <ul>
          <li>
            <strong>Client work first</strong> - Always be moving things along
            or waiting for client feedback
          </li>
          <li>
            <strong>Fridays for personal work</strong> - If you&apos;re
            full-time, Fridays are good for personal projects
          </li>
          <li>
            <strong>Delegate early</strong> - If something isn&apos;t clear, ask
            for clarity now. I&apos;d rather spend time upfront.
          </li>
          <li>
            <strong>Tell people you&apos;re blocking</strong> - &quot;I&apos;m
            waiting on you to do X so I can deliver Y by this date, otherwise
            Z&quot;
          </li>
        </ul>
        <hr />

        <h2 id="working-together">Working Together</h2>
        <ul>
          <li>
            <strong>Own your tasks</strong> - Don&apos;t wait for approval on
            every detail. Take action, even if mistakes happen.
          </li>
          <li>
            <strong>Give consistent updates</strong> - Silence creates stress.
            Even small updates help. If you get 1% off every day, you&apos;ll be
            completely off by end of week.
          </li>
          <li>
            <strong>Challenge me with feedback</strong> - Tell me what&apos;s not
            working. I need feedback to grow.
          </li>
          <li>
            <strong>Follow up after meetings</strong> - Clear summary of next
            steps and anything needing feedback.
          </li>
        </ul>
        <hr />

        <h2 id="my-leadership-approach">My Leadership Approach</h2>
        <p>
          I&apos;m a new manager. I want to be hands-off. If the team makes a
          mistake, I shoulder that responsibility as an opportunity to learn how
          to be a better leader.
        </p>
      </div>
    </div>
  );
}
