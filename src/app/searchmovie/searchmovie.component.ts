import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


interface GroupedService {
  name: string;
  types: Set<string>;
}

@Component({
  selector: 'app-searchmovie',
  templateUrl: './searchmovie.component.html',
  styleUrls: ['./searchmovie.component.css']
})


export class SearchmovieComponent {
  searchTerm: string = '';
  movie: any = null;
  apiKey: string = '10e768dc'; // Replace with your OMDb API key
  streamingDetails: string=''; // New property for streaming details
  streamingApiKey: string = '47b8046c66msh00c99c75be37895p12df69jsnca892e631be4'; // Your RapidAPI key for streaming availability
  streamingApiHost: string = 'streaming-availability.p.rapidapi.com';
  loading2: boolean = false;
  isLoggedIn: boolean = false; // Update based on authentication status
  showPopupMessage: boolean = false;

  constructor(private http: HttpClient, private router: Router, public authservice: AuthService) {}

  onSearch() {
    if (this.searchTerm.trim()) {
      const url = `https://www.omdbapi.com/?t=${this.searchTerm}&apikey=${this.apiKey}`;
      this.http.get(url).subscribe((data: any) => {
        if (data.Response === 'True') {
          this.movie = data;
           // Check for streaming details
           this.streamingDetails = ''; // Reset streaming details
          
        } else {
          alert('Movie not found!');
        }
      });
    } else {
      alert('Please enter a movie name');
    }
  }

 // Fetch streaming availability
//  streaming() {
//   if (this.movie && this.movie.Title) {
//     const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
//     const headers = {
//       'x-rapidapi-key': this.streamingApiKey,
//       'x-rapidapi-host': this.streamingApiHost
//     };

//     this.http.get(streamingUrl, { headers }).subscribe({
//       next: (data: any) => {
//         console.log("API Response:", data); // Log the full API response
//         console.log("data.in:",data.streamingOptions);
        
//         // Check if streamingOptions are available
//         if (data && data.streamingOptions && data.streamingOptions.in) {
//           const availablePlatforms = data.streamingOptions.in
//           .filter((option: StreamingOption) => option.available) // Use the defined interface
//           .map((option: StreamingOption) => option.platform); // Use the defined interface
//           // Format the streaming details message
//           console.log("availablePlatforms:",availablePlatforms);
          
//           if (availablePlatforms.length > 0) {
//             this.streamingDetails = `This movie is available on: ${availablePlatforms.join(', ')}.`;
//           } else {
//             this.streamingDetails = 'No streaming availability found.';
//           }
//         } else {
//           this.streamingDetails = 'No streaming availability found.';
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching streaming availability:', error);
//         alert('Failed to fetch streaming availability.');
//       },
//       complete: () => {
//         console.log('Request completed');
//       }
//     });
//   }
// }
// streaming() {
//   if (this.movie && this.movie.Title) {
//     const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
//     const headers = {
//       'x-rapidapi-key': this.streamingApiKey,
//       'x-rapidapi-host': this.streamingApiHost
//     };

//     this.http.get(streamingUrl, { headers }).subscribe({
//       next: (data: any) => {
//         console.log("API Response:", data); // Log the full API response

//         // Check if 'streamingOptions' and 'in' array are available
//         if (data && data.streamingOptions && Array.isArray(data.streamingOptions.in)) {
//           const availablePlatforms = data.streamingOptions.in
//             .filter((option: any) => option.service && option.service.name) // Filter valid platforms with a service name
//             .map((option: any) => option.service.name); // Extract platform names

          
//           console.log("availablePlatforms:", availablePlatforms); // Log the available platforms
          
//           // Format the streaming details message
//           if (availablePlatforms.length > 0) {
//             this.streamingDetails = `This movie is available on: ${availablePlatforms.join(', ')}.`;
//           } else {
//             this.streamingDetails = 'No streaming availability found.';
//           }
//         } else {
//           this.streamingDetails = 'No streaming availability found.';
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching streaming availability:', error);
//         alert('Failed to fetch streaming availability.');
//       },
//       complete: () => {
//         console.log('Request completed');
//       }
//     });
//   }
// }
// streaming() {
//   if (this.movie && this.movie.Title) {
//     const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
//     const headers = {
//       'x-rapidapi-key': this.streamingApiKey,
//       'x-rapidapi-host': this.streamingApiHost
//     };

//     this.http.get(streamingUrl, { headers }).subscribe({
//       next: (data: any) => {
//         console.log("API Response:", data); // Log the full API response
        
//         // Check if 'data' exists and log its structure
//         if (!data) {
//           console.error('Data is null or undefined');
//           this.streamingDetails = 'No streaming availability found.';
//           return;
//         }

//         // Log what 'streamingOptions' looks like to see its structure
//         console.log("streamingOptions:", data.streamingOptions);

//         // Check if 'streamingOptions' and 'in' array are available
//         if (data.streamingOptions && Array.isArray(data.streamingOptions.in)) {
//           const availablePlatforms = data.streamingOptions.in
//             .filter((option: any) => option.service && option.service.name) // Filter valid platforms with a service name
//             .map((option: any) => option.service.name); // Extract platform names
          
//           console.log("availablePlatforms:", availablePlatforms); // Log the available platforms
          
//           // Format the streaming details message
//           if (availablePlatforms.length > 0) {
//             this.streamingDetails = `This movie is available on: ${availablePlatforms.join(', ')}.`;
//           } else {
//             this.streamingDetails = 'No streaming availability found.';
//           }
//         } else {
//           console.error("'streamingOptions.in' is not an array or doesn't exist.");
//           this.streamingDetails = 'No streaming availability found.';
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching streaming availability:', error);
//         alert('Failed to fetch streaming availability.');
//       },
//       complete: () => {
//         console.log('Request completed');
//       }
//     });
//   }
// }

// streaming() {
//   if (this.movie && this.movie.Title) {
//     const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
//     const headers = {
//       'x-rapidapi-key': this.streamingApiKey,
//       'x-rapidapi-host': this.streamingApiHost
//     };

//     this.http.get(streamingUrl, { headers }).subscribe({
//       next: (data: any) => {
//         // Log the entire response to inspect its structure
//         console.log("Full API Response:", data);

//         // Since streamingOptions is undefined, let's inspect the structure at the top level
//         if (data) {
//           console.log('Available keys in response:', Object.keys(data)); // Log available keys in the response
//         }

//         // Use the actual structure to define conditions here
//         if (data && data.someKeyWhereStreamingInfoExists) {
//           const streamingInfo = data.someKeyWhereStreamingInfoExists;  // Adjust this key based on actual response structure

//           // Check if the streaming info is an array or valid object
//           if (Array.isArray(streamingInfo.in)) {
//             const availablePlatforms = streamingInfo.in
//               .filter((option: any) => option.service && option.service.name)
//               .map((option: any) => option.service.name);

//             if (availablePlatforms.length > 0) {
//               this.streamingDetails = `This movie is available on: ${availablePlatforms.join(', ')}.`;
//             } else {
//               this.streamingDetails = 'No streaming availability found.';
//             }
//           } else {
//             this.streamingDetails = 'No streaming availability found.';
//           }
//         } else {
//           this.streamingDetails = 'No streaming availability found.';
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching streaming availability:', error);
//         alert('Failed to fetch streaming availability.');
//       },
//       complete: () => {
//         console.log('Request completed');
//       }
//     });
//   }
// }

// streaming() {
//   if (this.movie && this.movie.Title) {
//     const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
//     const headers = {
//       'x-rapidapi-key': this.streamingApiKey,
//       'x-rapidapi-host': this.streamingApiHost
//     };
    

//     this.http.get(streamingUrl, { headers }).subscribe({
//       next: (data: any) => {
//         // Check if the response is an array
//         if (Array.isArray(data)) {
//           console.log("API Response is an array:", data);
          
//           // Iterate over the array to log each element and its structure
//           data.forEach((item: any, index: number) => {
//             console.log(`Item at index ${index}:`, item);

//             // If you suspect streaming info might be inside this object, log its keys
//             if (item && typeof item === 'object') {
//               console.log(`Keys in item at index ${index}:`, Object.keys(item));
//             }
//           });

//           // Assuming we need to find streaming options in the first item
//           const firstItem = data[0]; // Adjust index based on which item holds the streaming info
//           if (firstItem && firstItem.streamingOptions && Array.isArray(firstItem.streamingOptions.in)) {
//             const availablePlatforms = firstItem.streamingOptions.in
//               .filter((option: any) => option.service && option.service.name)
//               .map((option: any) => option.service.name);

//             if (availablePlatforms.length > 0) {
//               this.streamingDetails = `This movie is available on: ${availablePlatforms.join(', ')}.`;
//             } else {
//               this.streamingDetails = 'No streaming availability found.';
//             }
//           } else {
//             this.streamingDetails = 'No streaming availability found.';
//           }
//         } else {
//           console.error('Unexpected response format:', data);
//           this.streamingDetails = 'No streaming availability found.';
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching streaming availability:', error);
//         alert('Failed to fetch streaming availability.');
//       },
//       complete: () => {
//         console.log('Request completed');
//       }
//     });
//   }

  
// }

// streaming() {
//   if (this.movie && this.movie.Title) {
//     const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
//     const headers = {
//       'x-rapidapi-key': this.streamingApiKey,
//       'x-rapidapi-host': this.streamingApiHost
//     };

//     this.http.get(streamingUrl, { headers }).subscribe({
//       next: (data: any) => {
//         // Check if the response is an array
//         if (Array.isArray(data)) {
//           console.log("API Response is an array:", data);

//           // Iterate over the array to find streaming options
//           let streamingOptionsFound = false;

//           data.forEach((item: any, index: number) => {
//             console.log(`Item at index ${index}:`, item);

//             // If streamingOptions exist in this item, extract the information
//             if (item && item.streamingOptions) {
//               console.log(`Streaming options found for item at index ${index}:`, item.streamingOptions);
//               streamingOptionsFound = true;

//               // Check if 'in' exists in streamingOptions
//               if (Array.isArray(item.streamingOptions.in)) {
//                 const availablePlatforms = item.streamingOptions.in
//                   .filter((option: any) => option.service && option.service.name)
//                   .map((option: any) => option.service.name);

//                 if (availablePlatforms.length > 0) {
//                   this.streamingDetails = `This movie is available on: ${availablePlatforms.join(', ')}.`;
//                 } else {
//                   this.streamingDetails = 'No streaming availability found.';
//                 }
//               } else {
//                 this.streamingDetails = 'No streaming availability found.';
//               }
//             }
//           });

//           // If no streaming options were found in any item
//           if (!streamingOptionsFound) {
//             this.streamingDetails = 'No streaming availability found.';
//           }
//         } else {
//           console.error('Unexpected response format:', data);
//           this.streamingDetails = 'No streaming availability found.';
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching streaming availability:', error);
//         alert('Failed to fetch streaming availability.');
//       },
//       complete: () => {
//         console.log('Request completed');
//       }
//     });
//   }
// }

// streaming() {
//   if (this.movie && this.movie.Title) {
//     const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
//     const headers = {
//       'x-rapidapi-key': this.streamingApiKey,
//       'x-rapidapi-host': this.streamingApiHost
//     };

//     this.http.get(streamingUrl, { headers }).subscribe({
//       next: (data: any) => {
//         // Check if the response is an array and has at least one item
//         if (Array.isArray(data) && data.length > 0) {
//           console.log("API Response is an array:", data);

//           // Focus on the first item
//           const firstItem = data[0];
//           console.log(`First item:`, firstItem);

//           // Check if streamingOptions exist in the first item
//           if (firstItem && firstItem.streamingOptions && Array.isArray(firstItem.streamingOptions.in)) {
//             const availablePlatforms = firstItem.streamingOptions.in
//               .filter((option: any) => option.service && option.service.name)
//               .map((option: any) => option.service.name);

//             if (availablePlatforms.length > 0) {
//               this.streamingDetails = `This movie is available on: ${availablePlatforms.join(', ')}`;
//             } else {
//               this.streamingDetails = 'No streaming availability found.';
//             }
//           } else {
//             this.streamingDetails = 'No streaming availability found.';
//           }
//         } else {
//           console.error('Unexpected response format:', data);
//           this.streamingDetails = 'No streaming availability found.';
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching streaming availability:', error);
//         alert('Failed to fetch streaming availability.');
//       },
//       complete: () => {
//         console.log('Request completed');
//       }
//     });
//   }
// }

streaming() {
  this.loading2=true;
  
  if (this.movie && this.movie.Title) {
    const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.movie.Title)}&series_granularity=show&show_type=movie&output_language=en`;
    const headers = {
      'x-rapidapi-key': this.streamingApiKey,
      'x-rapidapi-host': this.streamingApiHost
    };

    this.http.get(streamingUrl, { headers }).subscribe({
      next: (data: any) => {
        this.loading2=false;
        // Check if the response is an array and has at least one item
        if (Array.isArray(data) && data.length > 0) {
        

          // Focus on the first item
          const firstItem = data[0];
          console.log(`First item:`, firstItem);

          // Check if streamingOptions exist in the first item
          if (firstItem && firstItem.streamingOptions && Array.isArray(firstItem.streamingOptions.in)) {
            const groupedServices: { [key: string]: GroupedService } = {}; // Use the interface here

            // Process each streaming option
            firstItem.streamingOptions.in.forEach((option: any) => {
              const serviceId = option.service.id;
              const serviceName = option.service.name;

              // Initialize the service if it doesn't exist
              if (!groupedServices[serviceId]) {
                groupedServices[serviceId] = { name: serviceName, types: new Set() };
              }

              // Add the type to the Set to avoid duplicates
              groupedServices[serviceId].types.add(option.type);
            });

            // Format the output for display
            const displayOptions = Object.values(groupedServices).map(service => {
              return `${service.name} (${[...service.types].join(' and ')})`;
            });
           
            

            // Join the options into a single string
            if (displayOptions.length > 0) {
             
              this.streamingDetails = `This movie is available on: ${displayOptions.join(', ')}`;
              console.log("streaming deatils:",this.streamingDetails);
              
            } else {
              this.streamingDetails = 'No streaming availability found.';
            }
          } else {
            this.streamingDetails = 'No streaming availability found.';
          }
        } else {
          console.error('Unexpected response format:', data);
          this.streamingDetails = 'No streaming availability found.';
        }
      },
      error: (error) => {
        console.error('Error fetching streaming availability:', error);
        alert('Failed to fetch streaming availability.');
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }
}
login(){
  if(this.authservice.isLoggedIn()){
    this.isLoggedIn=true;;
  }
}

showLoginPopup() {
    this.showPopupMessage = true;
}

closePopup() {
  this.showPopupMessage = false;
}

redirectToLogin() {
  // Navigate to login page
  this.router.navigate(['/login']);
}

redirectToSignup() {
  // Navigate to signup page
  this.router.navigate(['/signup']);
}


}
