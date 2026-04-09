import PhoneMockup from './PhoneMockup'

export default function App() {
  return (
    <article className="brief">
      <h1>YouTube Recommendations Refresh</h1>
      <p className="brief-subtitle">Product Brief</p>

      <section>
        <h2>Problem</h2>
        <p>
          When a user finishes or pauses a video on mobile and scrolls down, they enter the single
          video recommendations strip. If nothing in that strip grabs them, they close the app. The
          session ends.
        </p>
        <p>
          On the main recommendations screen, users have a natural escape valve: pull-to-refresh.
          It&rsquo;s a well-established behavior with demonstrated adoption. Users understand it,
          use it, and expect it.
        </p>
        <p>
          That behavior doesn&rsquo;t exist on the single video page. The pull-down gesture is
          already claimed by scroll. Pulling up returns the user to the video player. The result is
          a consistency gap: users who expect a refresh mechanism find nothing and leave.
        </p>
        <p>This is a session-ending moment with no current intervention.</p>
      </section>

      <section>
        <h2>Opportunity</h2>
        <p>
          The demand for this feature already exists and is already being expressed as session
          abandonment. Users who pull down on the single video recommendations strip and get no
          response aren&rsquo;t filing feedback. They&rsquo;re closing the app.
        </p>
        <p>
          A refresh mechanism at this exact moment targets the highest-leverage point in the
          session: the instant before the user leaves. Even a modest conversion rate of users who
          refresh instead of closing, find something worth watching, and extend their session by a
          few minutes, moves session time meaningfully at YouTube&rsquo;s scale.
        </p>
        <p><strong>Primary metric:</strong> Average session duration among users who scroll below the video player</p>
        <p><strong>Secondary metrics:</strong></p>
        <ul>
          <li>Refresh tap rate, adoption signal, target above 8% of eligible sessions</li>
          <li>Video start rate from recommendations strip post-refresh</li>
          <li>Session end rate immediately after scrolling below the video</li>
        </ul>
      </section>

      <section>
        <h2>Proposed Solution</h2>
        <p>Two variants, to be A/B tested against each other and against control.</p>

        <div className="brief-variants-grid">
          <div className="brief-variant-desc">
            <h3>Option A &mdash; Refresh Chip in Topic Filter Bar</h3>
            <p>
              Fits existing design language. No new UI patterns introduced. Low visual noise.
              Tapping regenerates the recommendation set with a new candidate pool, excluding
              already-shown video IDs.
            </p>
            <p className="brief-risk">
              <strong>Risk:</strong> Semantic ambiguity. Users may not distinguish the refresh chip
              from a topic filter. The icon needs to clearly communicate &ldquo;regenerate&rdquo;
              rather than &ldquo;filter.&rdquo;
            </p>
          </div>

          <div className="brief-variant-desc">
            <h3>Option B &mdash; Inline &ldquo;Refresh Suggestions&rdquo; Label</h3>
            <p>
              A small, tappable text label sitting directly above the topic filter bar. Explicit
              about intent. No semantic confusion with topic chips. Introduces a new visual
              element, but one that is immediately readable. Same tap behavior as Option A.
            </p>
            <p className="brief-risk">
              <strong>Risk:</strong> Adds visual hierarchy to a currently clean UI. Needs to be
              styled to feel lightweight so it reads as a utility control rather than a prominent
              CTA.
            </p>
          </div>

          <div className="brief-variant-mockup">
            <PhoneMockup variant="A" />
          </div>

          <div className="brief-variant-mockup">
            <PhoneMockup variant="B" />
          </div>
        </div>
      </section>

      <section>
        <h2>What Happens on Tap</h2>
        <p>In both variants, tapping refresh:</p>
        <ul>
          <li>Calls the existing recommendation API with a fresh session context</li>
          <li>Excludes video IDs already shown in the current strip</li>
          <li>Animates the strip reload with a brief skeleton state consistent with existing YouTube loading patterns</li>
          <li>
            Resets the topic filter selection back to <em>All</em> and regenerates both the topic
            chips and the video recommendations. Refresh means &ldquo;show me something
            different,&rdquo; which includes a new set of topics, not just new videos within the
            current context
          </li>
        </ul>
      </section>

      <section>
        <h2>What We&rsquo;re Not Building</h2>
        <ul>
          <li><strong>Pull-to-refresh gesture.</strong> The pull-down interaction is claimed by the scroll navigation on this page</li>
          <li><strong>A new recommendations algorithm.</strong> This calls the existing system with a context refresh</li>
          <li><strong>Persistent refresh history.</strong> The previous strip is not recoverable after refresh, consistent with how pull-to-refresh behaves on the main screen</li>
        </ul>
      </section>

      <section>
        <h2>Metrics</h2>
        <p><strong>North Star:</strong> Average session duration among users who scroll below the video player.</p>

        <h3>Primary Success Metric</h3>
        <p>5%+ lift in average session duration in treatment vs. control among the scrolled-below cohort.</p>

        <h3>Guardrail Metrics</h3>
        <ul>
          <li>Immediate session abandonment rate post-refresh. If users refresh and immediately close the app, the feature is disrupting rather than helping.</li>
          <li>Video start rate from the recommendations strip post-refresh. If second-pass recommendation quality is lower, start rate drops and the feature is net negative even if tap rate is high.</li>
        </ul>

        <h3>Diagnostic Metrics</h3>
        <ul>
          <li>Refresh tap rate. Target above 8% of eligible sessions. Below 3% at day 14 is the kill condition.</li>
          <li>Refresh loop rate (two or more refreshes with no video start). High loop rate signals recommendation inventory exhaustion, not feature failure.</li>
          <li>Session duration on refresh-initiated watches vs. strip-initiated watches. If videos started after a refresh produce longer sessions, users are finding better matches for their intent.</li>
        </ul>

        <h3>What We Are Not Measuring as Success</h3>
        <p>
          Raw impression count on the recommendations strip. A refresh that produces fewer but more
          relevant impressions is a better outcome. Optimize for starts-per-impression, not total
          impressions.
        </p>
      </section>

      <section>
        <h2>Test Design</h2>
        <p><strong>Duration:</strong> 30 days</p>
        <p><strong>Variants:</strong></p>
        <ul>
          <li>Control: current experience, no refresh mechanism</li>
          <li>Treatment A: refresh chip in topic filter bar</li>
          <li>Treatment B: inline Refresh suggestions label</li>
        </ul>
        <p>
          <strong>Success criteria:</strong> 5%+ lift in average session duration with refresh tap
          rate above 8% of eligible sessions.
        </p>
        <p>
          <strong>Kill condition:</strong> Refresh tap rate below 3% in both treatment arms at day
          14. The feature is not discoverable enough to move the primary metric. Pause and revisit
          the design before continuing.
        </p>
      </section>

      <section>
        <h2>Build Assessment</h2>
        <p><strong>What exists:</strong> Recommendation API, topic filter bar UI, strip render logic, session context tracking</p>
        <p><strong>What&rsquo;s new:</strong> One tap target (icon or text label), API call with exclusion parameter for already-shown video IDs, strip reload animation</p>
        <p><strong>Estimate:</strong> One frontend engineer, one designer, approximately one week of build, two weeks of test. No backend infrastructure changes. No cross-team dependencies.</p>
      </section>

      <section>
        <h2>Risks</h2>
        <ul>
          <li><strong>Semantic ambiguity (Option A):</strong> The refresh chip may be interpreted as a topic filter. Mitigated by icon choice.</li>
          <li><strong>New UI pattern (Option B):</strong> The inline label introduces a control not present elsewhere in YouTube mobile. Mitigated by lightweight styling and the A/B test.</li>
          <li><strong>Recommendation quality on refresh:</strong> If the second-pass candidate pool is materially lower quality than the first, refresh creates a worse experience. Mitigated by tracking video start rate post-refresh as a guardrail metric.</li>
          <li><strong>Refresh loops:</strong> Users who refresh two or more times without starting a video signal that recommendations have been exhausted for this session context. Track as a recommendation-quality health metric rather than a feature-failure signal.</li>
        </ul>
      </section>
    </article>
  )
}
