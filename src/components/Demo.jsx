/* Chipsa map landing — Demo (03). Media-led, anti-templated stack. */
import React from 'react';
import { Section, SectionHead, Frame, Caption, Reveal } from './primitives.jsx';
import { ASSETS } from '../data/assets.js';

export function Demo({ t }) {
  const d = t.demo;
  return (
    <Section id="demo" invert>
      <SectionHead num={d.num} kicker={d.kicker} title={d.title} lede={d.lede} invert />

      <div className="cl-stack">
        {/* Overview + booth popup — paired */}
        <div>
          <Reveal className="cl-pair">
            <Frame src={ASSETS.mainView} label={d.mainLabel} ratio="4 / 3" invert />
            <Frame src={ASSETS.popup} label={d.popupLabel} ratio="4 / 3" invert />
          </Reveal>
          <Caption kicker={d.mainPopup.capKicker} invert>{d.mainPopup.cap}</Caption>
        </div>

        {/* Premium zone — single cinematic frame, grid-break wide */}
        <div className="cl-bleed-wide">
          <Reveal>
            <Frame src={ASSETS.premiumZone} label={d.premiumZone.label + ' · ' + d.premiumZone.name} ratio="16 / 9" invert />
          </Reveal>
          <Caption kicker={d.premiumZone.capKicker} invert>{d.premiumZone.cap}</Caption>
        </div>

        {/* Standard vs premium — the commercial argument */}
        <div>
          <Reveal className="cl-pair cl-pair--compare">
            <Frame src={ASSETS.standardStand} label={d.stdLabel} ratio="4 / 3" invert />
            <Frame src={ASSETS.premiumStand} label={d.premLabel} ratio="4 / 3" invert />
          </Reveal>
          <Caption kicker={d.compare.capKicker} invert>{d.compare.cap}</Caption>
        </div>

        {/* Route video */}
        <div>
          <Reveal>
            <Frame video={ASSETS.route} label={d.route.label + ' · ' + d.route.name} ratio="16 / 9" invert />
          </Reveal>
          <Caption kicker={d.route.capKicker} invert>{d.route.cap}</Caption>
        </div>

        {/* Mobile context — phone in hand + two phones */}
        <div>
          <Reveal className="cl-pair">
            <Frame src={ASSETS.phoneInHand} label={d.handLabel} ratio="4 / 3" invert />
            <Frame src={ASSETS.phones} label={d.phonesLabel} ratio="4 / 3" invert />
          </Reveal>
          <Caption kicker={d.mobileContext.capKicker} invert>{d.mobileContext.cap}</Caption>
        </div>

        {/* Mobile journey video */}
        <div>
          <Reveal>
            <Frame video={ASSETS.mobile} label={d.mobileVideo.label + ' · ' + d.mobileVideo.name} ratio="16 / 9" invert />
          </Reveal>
          <Caption kicker={d.mobileVideo.capKicker} invert>{d.mobileVideo.cap}</Caption>
        </div>
      </div>
    </Section>
  );
}
