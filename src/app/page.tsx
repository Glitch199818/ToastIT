/* eslint-disable @next/next/no-img-element */
import PricingToggle from "@/components/landing/PricingToggle";

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="logo">
          ToastIT
        </a>
        <a href="/auth/signup" className="nbtn">
          Try for free
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>
          Turn your{" "}
          <img src="/logos/x-logo.png" alt="X" /> milestones into
          <br />
          doodles that <span className="r">Toast IT</span>
        </h1>
        <p className="hsub">
          Your milestone deserves more than a text tweet. Get visuals that make
          people stop and spark conversations.
        </p>
        <a href="/auth/signup" className="cbtn">
          Create your first doodle
        </a>

        {/* Hero Card */}
        <div className="cw">
          <div className="mc">
            <div className="dz">
              <img src="/doodles/mojito.png" alt="Mojito doodle" />
            </div>
            <div className="cc">
              <div className="cn">800</div>
              <div className="cl">Followers</div>
            </div>
            <div className="ch">@sushbuilds</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <h2 className="st">How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="sn">1</div>
            <div className="stt">Pick your drink</div>
            <div className="sd">
              Choose from hand-drawn doodles — cocktails, coffee, champagne, and
              more.
            </div>
          </div>
          <div className="step">
            <div className="sn">2</div>
            <div className="stt">Drop your milestone</div>
            <div className="sd">
              Type your number, your win, your flex. Add your handle.
            </div>
          </div>
          <div className="step">
            <div className="sn">3</div>
            <div className="stt">Toast it &amp; share</div>
            <div className="sd">
              Download your card and post it. Watch the likes roll in.
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLE CARDS */}
      <section className="ex">
        <h2 className="st">Cards people are toasting</h2>
        <div className="csc">
          <div className="mc2" style={{ background: "var(--cgo)" }}>
            <div className="dz">
              <img src="/doodles/wine.png" alt="Wine doodle" />
            </div>
            <div className="cc">
              <div className="cn">1K</div>
              <div className="cl">Followers</div>
            </div>
            <div className="ch">@indiemaker</div>
          </div>

          <div className="mc2" style={{ background: "var(--cg)" }}>
            <div className="dz">
              <img src="/doodles/cocktail.png" alt="Cocktail doodle" />
            </div>
            <div className="cc">
              <div className="cn">$500</div>
              <div className="cl">First MRR</div>
            </div>
            <div className="ch">@shipfast</div>
          </div>

          <div className="mc2" style={{ background: "var(--cy)" }}>
            <div className="dz">
              <img src="/doodles/iced_coffee.png" alt="Iced Coffee doodle" />
            </div>
            <div className="cc">
              <div className="cn">V1</div>
              <div className="cl">Shipped!</div>
            </div>
            <div className="ch">@builder</div>
          </div>

          <div className="mc2" style={{ background: "var(--cr)" }}>
            <div className="dz">
              <img src="/doodles/cosmo.png" alt="Cosmo doodle" />
            </div>
            <div className="cc">
              <div className="cn">50</div>
              <div className="cl">Waitlist</div>
            </div>
            <div className="ch">@creator</div>
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section className="tf">
        <h2 className="st">Your milestone deserves better</h2>
        <div className="tg">
          <div className="tc">
            <div className="tl">What you post now</div>
            <div className="bt">
              <div className="bth">
                <div className="bta"></div>
                <div className="btn2">
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="btt">
                just hit 800 followers! 🎉🎉🎉 thanks everyone!!
              </div>
              <div className="bts">
                <span>2 Reposts</span>
                <span>14 Likes</span>
              </div>
            </div>
          </div>

          <div className="tar">&rarr;</div>

          <div className="tc">
            <div className="tl">What you could post</div>
            <div className="acd">
              <div className="dz">
                <img src="/doodles/mojito.png" alt="Mojito doodle" />
              </div>
              <div className="cc">
                <div className="cn">800</div>
                <div className="cl">Followers</div>
              </div>
              <div className="ch">@sushbuilds</div>
            </div>
            <div className="acs">
              <span className="ast">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>{" "}
                18 Reposts
              </span>
              <span className="ast">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>{" "}
                124 Likes
              </span>
              <span className="ast">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>{" "}
                42 Bookmarks
              </span>
              <span className="btg">~9x more engagement</span>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="rr">
        <h2 className="st">These doodles actually work</h2>
        <p className="rrsub">
          Real posts from @sushbuilds. Drink doodles that sparked conversations,
          attracted followers, and stopped the scroll.
        </p>
        <div className="rrg">
          <div className="rrcard">
            <img
              className="rrimg"
              src="/screenshots/post-300-margarita.png"
              alt="300 followers milestone"
            />
            <div className="rrst">
              <span className="rrhi">
                6,024 views &middot; 80 likes &middot; 61 replies
              </span>
              <span>0 to 300 in a month — the margarita celebration</span>
            </div>
          </div>
          <div className="rrcard">
            <img
              className="rrimg"
              src="/screenshots/post-600-mimosa.png"
              alt="600 followers milestone"
            />
            <div className="rrst">
              <span className="rrhi">
                6,314 views &middot; 75 likes &middot; 81 replies
              </span>
              <span>
                Mimosa for 600 — over 100k impressions that month
              </span>
            </div>
          </div>
          <div className="rrcard">
            <img
              className="rrimg"
              src="/screenshots/post-900-cocktail.png"
              alt="900 followers milestone"
            />
            <div className="rrst">
              <span className="rrhi">
                8,884 views &middot; 47 likes &middot; 28 replies
              </span>
              <span>146 new followers in a single day</span>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="au">
        <h2 className="st">Built for people who celebrate out loud</h2>
        <div className="ag">
          <div className="ac">
            <div className="ae">🚀</div>
            <div className="at2">Indie Hackers</div>
            <div className="aq">&ldquo;Just hit my first $1K MRR!&rdquo;</div>
            <div className="ad2">
              Revenue milestones, launch days, first customers — make every win a
              moment.
            </div>
          </div>
          <div className="ac">
            <div className="ae">✨</div>
            <div className="at2">Content Creators</div>
            <div className="aq">&ldquo;10K followers!&rdquo;</div>
            <div className="ad2">
              Celebrate your growth and attract new followers with cards that pop.
            </div>
          </div>
          <div className="ac">
            <div className="ae">🛠️</div>
            <div className="at2">Builders in Public</div>
            <div className="aq">&ldquo;Shipped V1 today!&rdquo;</div>
            <div className="ad2">
              Share your journey with visuals that match your hustle.
            </div>
          </div>
          <div className="ac">
            <div className="ae">💡</div>
            <div className="at2">Anyone with a Win</div>
            <div className="aq">&ldquo;50 waitlist signups!&rdquo;</div>
            <div className="ad2">
              Big or small, every milestone deserves a proper toast.
            </div>
          </div>
        </div>
      </section>

      {/* MAKER */}
      <section className="mk">
        <div className="mkc">
          <div className="mkt">
            <h2 className="st">Made by a maker, for makers</h2>
            <p className="mks">
              I started drawing drink doodles to celebrate my own X milestones.
              Every 100 followers, I&apos;d pick a new drink and sketch it on my
              iPad.
            </p>
            <p className="mks">
              People kept commenting &ldquo;best way to celebrate a
              milestone&rdquo; and &ldquo;I wish I could draw like that&rdquo; —
              so I built ToastIT to let everyone toast their wins.
            </p>
            <p className="mks">
              Every drink is hand-drawn between nap times and night feeds (new
              mom life). No AI art, no stock templates. Just me, my Apple Pencil,
              and way too much iced coffee.
            </p>
            <a
              href="https://x.com/sushbuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="mkl"
            >
              @sushbuilds on X &rarr;
            </a>
          </div>
          <div className="mkd">
            <img
              className="mdi d1"
              src="/doodles/champagne.png"
              alt="Champagne doodle"
            />
            <img
              className="mdi d2"
              src="/doodles/margarita.png"
              alt="Margarita doodle"
            />
            <img
              className="mdi d3"
              src="/doodles/espresso_martini.png"
              alt="Espresso Martini doodle"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="fq">
        <h2 className="st">Frequently asked questions</h2>
        <div className="fql">
          <details className="fi">
            <summary>Is ToastIT free?</summary>
            <p>
              Yes! The free plan gives you access to 10 drinks, all templates,
              and 1 card export per week. Free cards include a small ToastIT
              watermark. Upgrade to Pro for unlimited exports, no watermark, and
              new drinks every week.
            </p>
          </details>
          <details className="fi">
            <summary>What do I get with Pro?</summary>
            <p>
              Pro gives you unlimited card exports, no watermark, new hand-drawn
              drinks added every week, the ability to request custom drinks, and
              a spot on the Toasters wall. $5/month or $29 for lifetime access.
            </p>
          </details>
          <details className="fi">
            <summary>How is this different from Canva?</summary>
            <p>
              Canva gives you a blank canvas and thousands of generic templates.
              ToastIT gives you hand-drawn drink doodles paired with your
              milestone — done in 10 seconds, not 10 minutes. Every doodle has
              personality because a real human draws it, not AI.
            </p>
          </details>
          <details className="fi">
            <summary>Can I request a custom drink?</summary>
            <p>
              Yes! Pro users can request specific drinks. Every doodle is
              hand-drawn on an iPad by our founder, so each one is unique and
              made with care.
            </p>
          </details>
          <details className="fi">
            <summary>What size are the cards?</summary>
            <p>
              Cards are 1336 x 800px — optimized for X/Twitter posts. Pro users
              get HD exports that look crisp on any screen.
            </p>
          </details>
          <details className="fi">
            <summary>Who draws the doodles?</summary>
            <p>
              Every single drink is hand-drawn on an iPad by @sushbuilds. No AI
              generation, no stock art. New drinks are added every week for Pro
              members.
            </p>
          </details>
          <details className="fi">
            <summary>Do I need design skills?</summary>
            <p>
              Nope. Pick a drink, type your milestone, download. The doodles do
              the heavy lifting.
            </p>
          </details>
        </div>
      </section>

      {/* PRICING */}
      <PricingToggle />

      {/* BOTTOM CTA */}
      <section className="bc">
        <h2>Your win deserves more than a text tweet.</h2>
        <p>Join creators who toast their milestones the fun way.</p>
        <a href="/auth/signup" className="cbtn">
          Create your first doodle
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <p>
          Built by{" "}
          <a
            href="https://x.com/sushbuilds"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Sush
          </a>{" "}
          &middot; drawn between nap times &middot;{" "}
          <a
            href="https://crumbs-waitlist.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Crumbs
          </a>
        </p>
      </footer>
    </>
  );
}
