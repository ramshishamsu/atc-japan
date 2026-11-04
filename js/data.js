const defaultVehicles = [
  {id:"ATC-1001", name:"2024 TOYOTA LAND CRUISER PRADO", category:"Car", make:"Toyota", body:"SUV", year:2024, mileage:"18,500 KM", fuel:"Petrol", transmission:"Auto", drive:"4WD", price:42000, images:["https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-1002", name:"2021 NISSAN CARAVAN", category:"Car", make:"Nissan", body:"Van", year:2021, mileage:"72,000 KM", fuel:"Diesel", transmission:"Auto", drive:"2WD", price:16800, images:["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-1003", name:"2023 HONDA VEZEL", category:"Car", make:"Honda", body:"SUV", year:2023, mileage:"22,400 KM", fuel:"Hybrid", transmission:"Auto", drive:"2WD", price:23500, images:["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-1004", name:"2019 SUZUKI JIMNY", category:"Car", make:"Suzuki", body:"SUV", year:2019, mileage:"48,000 KM", fuel:"Petrol", transmission:"Auto", drive:"4WD", price:17900, images:["https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-2001", name:"2024 MITSUBISHI CANTER FLAT BODY", category:"Truck", make:"Mitsubishi Fuso", body:"Flat Body", year:2024, mileage:"5,449 KM", fuel:"Diesel", transmission:"Manual", drive:"2WD", price:32000, images:["https://images.unsplash.com/photo-1586191582151-f73872dfd183?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-2002", name:"2018 HINO DUTRO CRANE TRUCK", category:"Truck", make:"Hino", body:"Crane Truck", year:2018, mileage:"96,000 KM", fuel:"Diesel", transmission:"Manual", drive:"2WD", price:28500, images:["https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-2003", name:"2020 ISUZU FORWARD DUMP TIPPER", category:"Truck", make:"Isuzu", body:"Dump Tipper", year:2020, mileage:"82,000 KM", fuel:"Diesel", transmission:"Manual", drive:"6x4", price:36500, images:["https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-2004", name:"2017 HINO TANK TRUCK", category:"Truck", make:"Hino", body:"Tank Truck", year:2017, mileage:"105,000 KM", fuel:"Diesel", transmission:"Manual", drive:"2WD", price:26000, images:["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-3001", name:"2020 KOMATSU PC128 EXCAVATOR", category:"Machinery", make:"Komatsu", body:"Excavator", year:2020, mileage:"4,250 Hours", fuel:"Diesel", transmission:"Hydraulic", drive:"Crawler", price:42000, images:["https://images.unsplash.com/photo-1579492450119-80542d516179?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-3002", name:"2019 HITACHI ZX135US EXCAVATOR", category:"Machinery", make:"Hitachi", body:"Excavator", year:2019, mileage:"5,100 Hours", fuel:"Diesel", transmission:"Hydraulic", drive:"Crawler", price:38500, images:["https://images.unsplash.com/photo-1580901368919-9e61a7a7f3a7?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-3003", name:"2021 KUBOTA TRACTOR", category:"Machinery", make:"Kubota", body:"Tractor Farming", year:2021, mileage:"1,850 Hours", fuel:"Diesel", transmission:"Auto", drive:"4WD", price:22500, images:["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."},
  {id:"ATC-3004", name:"2018 CATERPILLAR MINI EXCAVATOR", category:"Machinery", make:"Caterpillar", body:"Mini Excavator", year:2018, mileage:"3,900 Hours", fuel:"Diesel", transmission:"Hydraulic", drive:"Crawler", price:18500, images:["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80"], description:"Quality Japanese used vehicle available for worldwide export from ATC JAPAN."}
];

const brandList = [
  ["Isuzu","assets/logos/isuzu.png"],
  ["Mitsubishi Fuso","assets/logos/mitsubishi-fuso.png"],
  ["Nissan","https://commons.wikimedia.org/wiki/Special:FilePath/Nissan.svg"],
  ["Hino","assets/logos/hino.png"],
  ["UD Trucks","assets/logos/ud-trucks.png"],
  ["Toyota","https://commons.wikimedia.org/wiki/Special:FilePath/Toyota.svg"],
  ["Suzuki","https://commons.wikimedia.org/wiki/Special:FilePath/Suzuki.svg"],
  ["Daihatsu","assets/logos/daihatsu.png"],
  ["Honda","https://commons.wikimedia.org/wiki/Special:FilePath/Honda%20Logo.svg"],
  ["Mercedes-Benz","assets/logos/mercedes-benz.png"],
  ["Hitachi","https://commons.wikimedia.org/wiki/Special:FilePath/Hitachi%20Logo%20with%20symbol.svg"],
  ["Caterpillar","https://commons.wikimedia.org/wiki/Special:FilePath/Caterpillar%20logo.svg"],
  ["Hyundai","https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai%20logo.svg"],
  ["Kia","https://commons.wikimedia.org/wiki/Special:FilePath/KIA%20logo3.svg"],
  ["Lexus","assets/logos/lexus.png"],
  ["Audi","https://commons.wikimedia.org/wiki/Special:FilePath/Audi%20Logo.svg"],
  ["Volkswagen","https://commons.wikimedia.org/wiki/Special:FilePath/Volkswagen%20Logo.svg"]
];


const bodyTypes = [
  ["Flat Body","fa-truck"],["Van Wing","fa-truck-moving"],["Freezer Truck","fa-snowflake"],["Crane Truck","fa-truck-pickup"],
  ["Dump Tipper","fa-truck-ramp-box"],["Concrete Mixer","fa-truck"],["Tank Truck","fa-truck-droplet"],["Garbage Truck","fa-trash-can"],
  ["Double Cab","fa-truck-pickup"],["Aerial Platform","fa-arrow-up"],["Vacuum Truck","fa-truck"],["Concrete Pump","fa-pump-soap"],
  ["Arm Roll","fa-truck"],["Self Loader","fa-truck-ramp-box"],["Trailer Head","fa-truck-front"],["Other Trucks","fa-truck"],
  ["SUV","fa-car-side"],["Sedan","fa-car"],["Mini Van","fa-van-shuttle"],["Hatchback","fa-car-side"],
  ["Excavator","fa-tractor"],["Wheel Loader","fa-tractor"],["Bulldozer","fa-tractor"],["Forklift","fa-dolly"],
  ["Tractor Farming","fa-tractor"],["Mini Excavator","fa-tractor"]
];


function normalizeVehicle(v){
  const images = Array.isArray(v.images) && v.images.length ? v.images : (v.image ? [v.image] : []);
  return {...v, images, image: images[0] || ""};
}

let vehiclesCache = defaultVehicles.map(normalizeVehicle);
let vehiclesLoadError = null;
async function loadVehicles(){
  try {
    const response = await fetch('/.netlify/functions/vehicles', {cache:'no-store'});
    if(!response.ok) throw new Error('Vehicle service unavailable');
    const data = await response.json();
    if(!Array.isArray(data.vehicles)) throw new Error('Invalid vehicle data');
    vehiclesCache = data.vehicles.map(normalizeVehicle);
    vehiclesLoadError = null;
  } catch(error) {
    vehiclesLoadError = error;
    // Keep the bundled starter catalogue visible if the API has not yet been configured.
    console.warn('ATC live inventory could not be loaded; showing starter catalogue.', error);
  }
  return vehiclesCache;
}
function getVehicles(){ return vehiclesCache; }
