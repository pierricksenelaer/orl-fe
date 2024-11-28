'use client'

import moment from "moment";
import App from "next/app";
import React, { use, useEffect, useState } from "react";

export default function Countdown({ unixEndDate } : { unixEndDate: number }) { {
  const [countdownTimer, setCountdownTimer] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0
  });
  const [countdownInfoMessage, setCountdownInfoMessage] = useState("");

  useEffect(() => {
    let timer: number = 0;

    if (unixEndDate) {
      timer = window.setInterval(() => playTimer(unixEndDate), 1000);
    }

    return () => {
      clearInterval(timer);
      timer = 0;
    };
  }, [unixEndDate]);

  const playTimer = (currentUnixEndDate: number) => {
    const distance: number = currentUnixEndDate - moment().unix();

    if (distance > 0) {
      setCountdownTimer({
        days: distance / (60 * 60 * 24),
        hours: (distance % (60 * 60 * 24)) / (60 * 60),
        mins: (distance % (60 * 60)) / 60,
        secs: distance % 60,
      });
      setCountdownInfoMessage("");
    } else {
      setCountdownInfoMessage(
        "Countdown ended. Click the Settings button to start a new countdown.",
      ); 
      setCountdownTimer({
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0
      });
    }
  }

  return (
    <div className="countdown">
      <div className="card">
        <div className="countdown-value">{countdownTimer?.days}</div>
        <div className="countdown-unit">Days</div>
      </div>
      <div className="card">
        <div className="countdown-value">{countdownTimer?.hours}</div>
        <div className="countdown-unit">Hours</div>
      </div>
      <div className="card">
        <div className="countdown-value">{countdownTimer?.mins}</div>
        <div className="countdown-unit">Mins</div>
      </div>
      <div className="card">
        <div className="countdown-value">{countdownTimer?.secs}</div>
        <div className="countdown-unit">Secs</div>
      </div>
      <p>
        Counting down to on
        {moment.unix(unixEndDate).format("dddd, MMMM Do, YYYY | h:mm A")}
      </p>
    </div>
  );
  }
}
