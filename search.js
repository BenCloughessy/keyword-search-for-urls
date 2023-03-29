// Get data
class PlaceFinder {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // search individual locations
    async searchLocation (keyword) {
        let query = keyword
        let baseUrl = 'https://api.tomtom.com/search/2/poiSearch';
        let queryString = `limit=${100}&countrySet=US&categorySet=9663005%2C%209663004%2C%209663003%2C%209663002%2C%209663002%2C%209152%2C%209153&view=Unified&relatedPois=off&key=${this.apiKey}`;

        try {
            return await fetch(`${baseUrl}/${query}.json?${queryString}`)
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                return response.results
            })
            
        } catch(error) {
            console.error("Error during searchLocation API call:", error.message);
            return [];
        }
    }

    // Filter function to keep only relevant results and remove duplicates
    filterResults(results) {
        const uniqueIds = new Set()
        const uniqueAddresses = new Set()
        const uniqueUrls = new Set()

        return results.filter(result => {
            const address = result.address.freeformAddress.toLowerCase()
            const url = result.poi.url
            if(url) {
                // Filter to remove duplicates
                if (uniqueIds.has(result.id) || uniqueAddresses.has(address) || uniqueUrls.has(url)) {
                    return false
                } else {
                    uniqueIds.add(result.id)
                    uniqueAddresses.add(address)
                    uniqueUrls.add(url)
                    return true
                }     
            }  
        })
    }

    async getPlaces(searchTerms) {
        const keyword = encodeURI(searchTerms)

        // Search location then call filter function
        return this.searchLocation(keyword)
        .then((res) => {
            return this.filterResults(res)
        })
        .then((res) => {
            return res
        })    
    }
}

// Call to TomTom's placeFinder API passing my API key and user location
const search = async(searchTerms) => {
    let placeFinder = new PlaceFinder('aWYBPDg8q4jsUHu3EViMzBg3kJi91gaV');
    let searchResults = await placeFinder.getPlaces(searchTerms)

    console.log(searchResults)

    displayResults(searchResults)
  }


// Interact with UI  
const searchButton = document.querySelector(".btn")
const input = document.querySelector(".search-bar")

searchButton.addEventListener("click", () => search(input.value))

// Display Results
function displayResults(results) {
    // Get the output container
    const outputContainer = document.querySelector('.output-container');
    
    // Loop through the objects array
    results.forEach((result) => {
      // Create a new element for each object
      const newElement = document.createElement('div');
      
      // Assign the class "name-url" to the new element
      newElement.classList.add('name-url');
      
      // Set the content of the new element
      newElement.innerHTML = `
        <a href="https://${result.poi.url}" target="_blank">
            <p> <u>${result.poi.name}</u> </p>
            <p>${result.poi.url}</p>
        </a>
      `;
      
      // Append the new element to the output container
      outputContainer.appendChild(newElement);
    });
  }
  

