export function timeParser(time) {
  const week = ["Undefined", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  if (time == null) {
    return "Never seen";
  }
  const parser = new Date(time);
  const current = new Date();
  let lastSeenDay = "Last seen ";
  let lastSeenTime = " at " + parser.getHours() + ":" + parser.getMinutes();
  if (parser.getMonth() === current.getMonth() && parser.getFullYear() === current.getFullYear()) {
    if (parser.getDay() === current.getDay()) {
      if (current - parser < 60 * 1000) {
        return lastSeenDay + "less than a minute ago";
      }
      if (current - parser < 60 * 60 * 1000) {
        const minutesAgo = Math.floor((current - parser) / 60 / 1000);
        return lastSeenDay + minutesAgo + " minutes ago";
      }
      if (current - parser < 24 * 60 * 60 * 1000) {
        const minutesAgo = Math.floor((current - parser) / 60 / 60 / 1000);
        return lastSeenDay + minutesAgo + " hours ago";
      }
    }
    if (current - parser < 48 * 60 * 60 * 1000) {
      lastSeenDay += "yesterday";
      return lastSeenDay + lastSeenTime;
    }
    if (current - parser < 7 * 24 * 60 * 60 * 1000) {
      lastSeenDay += week[parser.getDay()];
      return lastSeenDay + lastSeenTime;
    }
    if (current - parser < 7 * 24 * 60 * 60 * 1000) {
      lastSeenDay += week[parser.getDay()];
      return lastSeenDay + lastSeenTime;
    }
  }
  lastSeenDay += parser.getFullYear() + "/" + (parser.getMonth() + 1) + "/" + parser.getDate();
  return lastSeenDay + lastSeenTime;
}

export function urlParser() {
  const parsed = window.location.href.split("=");
  return parsed[1];
}
export function isConnected(lastSeen) {
  //isConnected checks if the user was connected in the 5 last minutes
  return new Date() - new Date(lastSeen) < 5 * 60 * 1000;
}
