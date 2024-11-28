"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import DatePickerWithRange from "./date-picker-with-range";
import TimezoneSelect, { ITimezone } from "react-timezone-select";
import { DateRange } from "react-day-picker";
import moment from "moment-timezone";

type DateAndTimeZonePickerProps = {
  timeZone: string;
  setTimeZone: React.Dispatch<React.SetStateAction<string>>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export default function DateAndTimeZonePicker({
  timeZone,
  setTimeZone,
  date,
  setDate,
}: DateAndTimeZonePickerProps) {
  const [timeZoneSelect, setTimeZoneSelect] = useState<any>(timeZone);
  moment.tz.setDefault("America/Los_Angeles");

  useEffect(() => {
    setTimeZoneSelect({ value: timeZone });
  }, [timeZone]);
  return (
    <>
      <Card className="w-fit">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="shrink-0">
                  Pick the start and end dates
                </Label>
                <DatePickerWithRange
                  className="[&>button]:w-[260px]"
                  date={date}
                  setDate={setDate}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="shrink-0">
                  Pick a time-ezone
                </Label>
                <TimezoneSelect
                  value={timeZoneSelect}
                  onChange={(obj) => setTimeZone(obj.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
