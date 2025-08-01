// Test script to verify rating calculation for Port Phillip Head Dive

const windDirectionAngles = {
  "North": 0,
  "North East": 45,
  "East": 90,
  "South East": 135,
  "South": 180,
  "South West": 225,
  "West": 270,
  "North West": 315
};

function computeRating(site, weather, marine) {
  let score = 0;
  const windDir = weather.wind_direction;
  
  if (Array.isArray(site.goodWindDirections)) {
    let minDiff = 180;
    site.goodWindDirections.forEach(dir => {
      const dirAngle = windDirectionAngles[dir] || 180;
      let diff = Math.abs(windDir - dirAngle);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) minDiff = diff;
    });
    
    console.log(`Wind direction: ${windDir}°, minDiff: ${minDiff}°`);
    
    if (site.isPortPhillipBay) {
      console.log("Using Port Phillip Bay logic");
      if (minDiff <= 30 && weather.wind_speed < 30) {
        score += 5; // Good
        console.log("Good wind conditions: +5");
      } else if (minDiff <= 60 && weather.wind_speed < 30) {
        score += 2; // Moderate
        console.log("Moderate wind conditions: +2");
      } else {
        score -= 2; // Poor
        console.log("Poor wind conditions: -2");
      }
    } else {
      console.log("Using ocean-facing logic");
      if (minDiff <= 30) {
        score += 3;
        console.log("Good wind direction: +3");
      } else if (minDiff <= 60) {
        score += 1;
        console.log("Moderate wind direction: +1");
      } else {
        score -= 1;
        console.log("Poor wind direction: -1");
      }
      
      const wave = marine.wave_height;
      console.log(`Wave height: ${wave}m`);
      if (wave < 0.7) {
        score += 2;
        console.log("Good wave conditions: +2");
      } else if (wave < 1.2) {
        score += 0;
        console.log("Moderate wave conditions: +0");
      } else {
        score -= 2;
        console.log("Poor wave conditions: -2");
      }
      
      if (site.maxSwellHeight && wave > site.maxSwellHeight) {
        score -= 2;
        console.log(`Wave exceeds max swell height (${site.maxSwellHeight}m): -2`);
      }
    }
  }
  
  return score;
}

// Test case: Port Phillip Head Dive with the conditions you mentioned
const site = {
  name: "Port Phillip Head Dive",
  goodWindDirections: ["North", "North West", "North East", "West", "South West", "South", "South East", "East"],
  maxSwellHeight: 2.0,
  isPortPhillipBay: true, // This was missing!
  coords: { lat: -38.284561, lon: 144.639262 },
  distanceFromShop: 90
};

const weather = {
  wind_speed: 4.4,
  wind_direction: 0 // North
};

const marine = {
  wave_height: 1.7
};

console.log("Testing Port Phillip Head Dive rating:");
console.log(`Site: ${site.name}`);
console.log(`Wind: ${weather.wind_speed} km/h from North (${weather.wind_direction}°)`);
console.log(`Waves: ${marine.wave_height} m`);
console.log(`Is Port Phillip Bay: ${site.isPortPhillipBay}`);
console.log("---");

const rating = computeRating(site, weather, marine);
console.log(`---`);
console.log(`Final score: ${rating}`);

let label = '';
if (rating >= 4) { label = 'Good'; }
else if (rating >= 1) { label = 'Moderate'; }
else { label = 'Poor'; }

console.log(`Rating: ${label}`);

// Test without isPortPhillipBay property
console.log("\n" + "=".repeat(50));
console.log("Testing WITHOUT isPortPhillipBay property:");

const siteWithoutBay = {
  name: "Port Phillip Head Dive",
  goodWindDirections: ["North", "North West", "North East", "West", "South West", "South", "South East", "East"],
  maxSwellHeight: 2.0,
  // isPortPhillipBay: true, // Missing this property
  coords: { lat: -38.284561, lon: 144.639262 },
  distanceFromShop: 90
};

const ratingWithoutBay = computeRating(siteWithoutBay, weather, marine);
console.log(`Final score without isPortPhillipBay: ${ratingWithoutBay}`);

let labelWithoutBay = '';
if (ratingWithoutBay >= 4) { labelWithoutBay = 'Good'; }
else if (ratingWithoutBay >= 1) { labelWithoutBay = 'Moderate'; }
else { labelWithoutBay = 'Poor'; }

console.log(`Rating without isPortPhillipBay: ${labelWithoutBay}`);