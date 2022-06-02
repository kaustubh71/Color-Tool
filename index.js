//Referencing DOM from HTML
const hexInput = document.getElementById("hexInput")
const toggleBtn = document.getElementById("toggleBtn")
const sliderText = document.getElementById("sliderText")
const slider = document.getElementById("slider")
const inputColor = document.getElementById("inputColor")
const alteredColor = document.getElementById("alteredColor")
const lightenText = document.getElementById("lightenText")
const darkenText = document.getElementById("darkenText")
const alteredColorText = document.getElementById("alteredColorText")

//function to check is hex value is valid or not
const isValidHex = (hex) => {
    if(/^#*([A-Fa-f0-9]{3})$/.test(hex) || /^#*([A-Fa-f0-9]{6})$/.test(hex)) //Regular Expression to check if the hex value is between A-F, 0-9 and 3 or 6 character in length
        return true
    else {return false}
}

//function to convert hex value to RGB
const hexToRGB = (hex) => {
    if (!isValidHex(hex)) return //first checking if the hex value is valid or not
    
    let stripHex = hex.replace("#", "")//removing # so that in next step can check the accurate length of hex
    
    //function if the hex value is 3 character then it will convert it to 6
    if (stripHex.length === 3) {
        stripHex = 
          stripHex[0] + stripHex[0]
        + stripHex[1] + stripHex[1] 
        + stripHex[2] + stripHex[2]   
    }
    
    //substring to pick only the first two characters of hex for r and parseInt to convert that value to its appropriate value
    const r = parseInt(stripHex.substring(0,2), 16)
    const g = parseInt(stripHex.substring(2,4), 16)
    const b = parseInt(stripHex.substring(4,6), 16)
    
    return {r,g,b} //this will return r,g,b in an object
}

//function to convert rgb value to hex
const RGBToHex = (r,g,b) => {
    const firstPair = ("0" + r.toString(16)).slice(-2) //toString is to convert r value into hex value
    const secondPair = ("0" + g.toString(16)).slice(-2)//concating 0 in front because if the toString method gives single character hex it will be converted into a pair
    const thirdPair = ("0" + b.toString(16)).slice(-2)//slice method is used so that even if we get 2 character from toString method it will only pick last 2 characters from the whole string
    
    const hexValue = "#" + firstPair + secondPair + thirdPair
    return hexValue
}

//calling hexInput element from HTML
hexInput.addEventListener("keyup", () => {
    if(!isValidHex(hexInput.value)) return
    
    const stripHex = hexInput.value.replace("#", "")
    inputColor.style.backgroundColor = `#${stripHex}` // this function will display color in the inputColor div or class
    alteredColor.style.backgroundColor = `#${stripHex}`
    alteredColorText.textContent = `Altered Color: #${stripHex}`
    
})

//calling slider input element from HTML
slider.addEventListener("input", () => {
    sliderText.textContent = `${slider.value}%`
    
   //ternary operator is used so that we can get positive or negative value based on the toggle button position. I tried if else statement but it didn't work
    const lightenOrDarken  = 
    toggleBtn.classList.contains('toggled') ? 
    -slider.value 
    : slider.value
  
    
    const newHex = alterColor(hexInput.value, lightenOrDarken)
    alteredColor.style.backgroundColor = newHex // this will display the altered color based on the hex input and % value in slider
    alteredColorText.textContent = `Altered Color: ${newHex}`
})

//In this function first hex is convereted to rgb and then based on the percentage the value is added to the rgb value then that new rgb value is converted back to hex value 
const alterColor = (hex, percentage) => {
   const {r,g,b} = hexToRGB(hex) //object {r,g,b} is declared so that the output of the function hexToRGB will be assigned to them
   
   const  amount =  Math.floor((percentage/100)*255) // Math.floor is used so that the amount calculated will always be integer 
   
   const newR = RGBValueRangeCheck(r, amount)
   const newG = RGBValueRangeCheck(g, amount)
   const newB = RGBValueRangeCheck(b, amount)
   
   return RGBToHex(newR, newG, newB)
}

//this function checks that the hex value is in the range of 0 to 255
const RGBValueRangeCheck = (hex, amount) => {
  return Math.min(255 ,Math.max(0, hex+amount)) //This function works inside out. first hex+amount is added thrn using Math.max we are choosing max value out of 0 and the value. This will ensure that we dont get negative value and in the same way Math.min will ensure that we don't get value more than 255
}

//toggleBtn is called from the html. this function will make toggle botton work and at the same time will lighten or darken the text in the toggle button
toggleBtn.addEventListener("click", () => {
    if (toggleBtn.classList.contains("toggled")){
        toggleBtn.classList.remove("toggled")
        lightenText.classList.remove("unselected")
        darkenText.classList.add("unselected")
    } else {
        toggleBtn.classList.add("toggled")
        lightenText.classList.add("unselected")
        darkenText.classList.remove("unselected")
    }
   
    reset() //reset is used here so that when toggle is clicked it will reset slider back to zero and altered color box to color as hex input value
})


const reset = () => {
    slider.value = 0
    sliderText.textContent = "0%"
    alteredColor.style.backgroundColor = hexInput.value
    alteredColorText.textContent = `Altered Color: ${hexInput.value}`
}