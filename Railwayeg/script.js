const trainData = {
    'london paddington': [
        { time: '08:15', destination: 'Reading', operator: 'GWR', platform: 'Platform 1', status: 'on-time', delay: 0 },
        { time: '08:25', destination: 'Oxford', operator: 'GWR', platform: 'Platform 3', status: 'delayed', delay: 15 },
        { time: '08:35', destination: 'Bath Spa', operator: 'GWR', platform: 'Platform 2', status: 'on-time', delay: 0 },
        { time: '08:45', destination: 'Bristol Temple Meads', operator: 'GWR', platform: 'Platform 4', status: 'delayed', delay: 8 },
        { time: '09:00', destination: 'Cardiff Central', operator: 'GWR', platform: 'Platform 1', status: 'cancelled', delay: 0 },
        { time: '09:10', destination: 'Heathrow Airport', operator: 'Heathrow Express', platform: 'Platform 6', status: 'on-time', delay: 0 },
        { time: '09:20', destination: 'Swansea', operator: 'GWR', platform: 'Platform 3', status: 'on-time', delay: 0 },
        { time: '09:30', destination: 'Plymouth', operator: 'GWR', platform: 'Platform 2', status: 'delayed', delay: 12 }
    ],
    'manchester piccadilly': [
        { time: '08:20', destination: 'London Euston', operator: 'Avanti West Coast', platform: 'Platform 5', status: 'on-time', delay: 0 },
        { time: '08:35', destination: 'Birmingham New Street', operator: 'CrossCountry', platform: 'Platform 2', status: 'delayed', delay: 5 },
        { time: '08:50', destination: 'Leeds', operator: 'Northern Rail', platform: 'Platform 7', status: 'on-time', delay: 0 },
        { time: '09:05', destination: 'Glasgow Central', operator: 'Avanti West Coast', platform: 'Platform 5', status: 'delayed', delay: 20 },
        { time: '09:15', destination: 'Liverpool Lime Street', operator: 'Northern Rail', platform: 'Platform 3', status: 'on-time', delay: 0 },
        { time: '09:25', destination: 'Sheffield', operator: 'Northern Rail', platform: 'Platform 8', status: 'cancelled', delay: 0 },
        { time: '09:40', destination: 'Preston', operator: 'Northern Rail', platform: 'Platform 4', status: 'on-time', delay: 0 }
    ],
    'birmingham new street': [
        { time: '08:10', destination: 'London Euston', operator: 'Avanti West Coast', platform: 'Platform 4', status: 'delayed', delay: 10 },
        { time: '08:25', destination: 'Manchester Piccadilly', operator: 'CrossCountry', platform: 'Platform 7', status: 'on-time', delay: 0 },
        { time: '08:40', destination: 'Bristol Temple Meads', operator: 'CrossCountry', platform: 'Platform 2', status: 'on-time', delay: 0 },
        { time: '08:55', destination: 'Wolverhampton', operator: 'West Midlands Railway', platform: 'Platform 6', status: 'delayed', delay: 3 },
        { time: '09:10', destination: 'Coventry', operator: 'West Midlands Railway', platform: 'Platform 1', status: 'on-time', delay: 0 },
        { time: '09:20', destination: 'Nottingham', operator: 'CrossCountry', platform: 'Platform 8', status: 'on-time', delay: 0 },
        { time: '09:35', destination: 'Edinburgh Waverley', operator: 'CrossCountry', platform: 'Platform 3', status: 'delayed', delay: 18 }
    ],
    'edinburgh waverley': [
        { time: '08:15', destination: 'Glasgow Queen Street', operator: 'ScotRail', platform: 'Platform 2', status: 'on-time', delay: 0 },
        { time: '08:30', destination: 'London King\'s Cross', operator: 'LNER', platform: 'Platform 8', status: 'delayed', delay: 7 },
        { time: '08:45', destination: 'Aberdeen', operator: 'ScotRail', platform: 'Platform 6', status: 'on-time', delay: 0 },
        { time: '09:00', destination: 'Inverness', operator: 'ScotRail', platform: 'Platform 4', status: 'on-time', delay: 0 },
        { time: '09:15', destination: 'Birmingham New Street', operator: 'CrossCountry', platform: 'Platform 3', status: 'delayed', delay: 25 },
        { time: '09:30', destination: 'Dundee', operator: 'ScotRail', platform: 'Platform 5', status: 'cancelled', delay: 0 },
        { time: '09:40', destination: 'Stirling', operator: 'ScotRail', platform: 'Platform 1', status: 'on-time', delay: 0 }
    ]
};
let station_search_box= document.getElementById("station_search_box")
let btn_search = document.getElementById("btn_search")
let train_list = document.getElementById("train_list")

// btn_search.addEventListener("click",function()
station_search_box.addEventListener("keyup",function()
{
    let value_to_search = station_search_box.value.trim().toLowerCase()
    if(value_to_search=="")
    {
        train_list.innerHTML = `<li>Please Enter a station name </li>`
        return
    }
    const matchedStation = Object.keys(trainData).find((s)=>s.includes(value_to_search))
    if(!matchedStation)
    {
        train_list.innerHTML = "<li>Station not found</li>"
        return
    }
    // alert(matchedStation)
    train_list.innerHTML=""
    trainData[matchedStation].forEach(train=>
    {
        const li  = document.createElement("li")
        if(train.status =="on-time")
        {
            li.classList.add("bg-green")
        }
        else if(train.status === "delayed"){
            li.classList.add("bg-orange")
        }
        else{
            li.classList.add("bg-red")
        }
        //, platform: 'Platform 2', status: 'delayed', delay: 12 }
        li.innerHTML = `${matchedStation}------------- ${train.time} - ${train.destination} (${train.operator}) |  ${train.platform}  |status: ${train.status} | delay : ${train.delay} min`
        train_list.appendChild(li)
    }
    )
})
