import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';


interface GroupedService {
  name: string;
  types: Set<string>;
}

@Component({
  selector: 'app-recom',
  templateUrl: './recom.component.html',
  styleUrls: ['./recom.component.css']
})
export class RecomComponent {
  selectedGenre: string = '';
  hollywoodMovie: any = null; // To hold a single movie object
  errorMessage: string | null = null;
  loading: boolean = false; // New variable to track loading state
  loading2: boolean = false; 
  streamingDetails: string=''; // New property for streaming details
  streamingApiKey: string = '47b8046c66msh00c99c75be37895p12df69jsnca892e631be4'; // Your RapidAPI key for streaming availability
  streamingApiHost: string = 'streaming-availability.p.rapidapi.com';
  loggedInUserId: string = '';

  constructor(private http: HttpClient, private apiService: ApiService,private AuthService: AuthService) {}

  ngOnInit(): void {
    this.loggedInUserId = this.AuthService.getCurrentUserId() ?? ''; 
  }


  etchHollywoodMoviesByGenre() {
    this.errorMessage = null; // Reset the error message
    this.loading = true; // Set loading to true when starting to fetch data

    const url = `https://moviesverse1.p.rapidapi.com/movies-by-genre?genre=${this.selectedGenre}`;
  
    this.http.get<any>(url, {
      headers: {
        'x-rapidapi-key': '47b8046c66msh00c99c75be37895p12df69jsnca892e631be4', // Replace with your actual key
        'x-rapidapi-host': 'moviesverse1.p.rapidapi.com'
      }
    }).subscribe({
      next: (response) => {
        this.loading = false; // Set loading to false once the response is received
        if (response && response.movies && response.movies.length > 0) {
          // Filter movies to only include those with a rating above 6
          const filteredMovies = response.movies.filter((movie:any) => {
            const rating = parseFloat(movie.imdbRating); // Parse the rating to a number
            return rating > 6; // Keep movies with a rating greater than 6
          });
  
          if (filteredMovies.length > 0) {
            // Generate a random index based on the number of filtered movies available
            const randomIndex = Math.floor(Math.random() * filteredMovies.length);
            this.hollywoodMovie = filteredMovies[randomIndex]; // Get a random movie from the filtered list
            
          } else {
            this.errorMessage = 'No movies found with a rating above 6.';
          }
        } else {
          this.errorMessage = 'No movies found.';
        }
      },
      error: (error) => {
        this.loading = false; // Set loading to false on error
        this.errorMessage = 'Error fetching movies. Please try again.';
        console.error('Error:', error);
      }
    });
  }

  streaming() {
  
    this.loading2=true;
    if (this.hollywoodMovie) {
      const streamingUrl = `https://${this.streamingApiHost}/shows/search/title?country=in&title=${encodeURIComponent(this.hollywoodMovie.title)}&series_granularity=show&show_type=movie&output_language=en`;
      const headers = {
        'x-rapidapi-key': this.streamingApiKey,
        'x-rapidapi-host': this.streamingApiHost
      };
  
      this.http.get(streamingUrl, { headers }).subscribe({
       
        next: (data: any) => {
          this.loading2=false;
          // Check if the response is an array and has at least one item
          if (Array.isArray(data) && data.length > 0) {
            console.log("API Response is an array:", data);
  
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
              console.log("streamoptions:",displayOptions);
              
  
              // Join the options into a single string
              if (displayOptions.length > 0) {
                this.streamingDetails = `This movie is available on: ${displayOptions.join(', ')}`;
                console.log('Streaming availability data:', data);

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


  //movie rating into number

  getNumericRating(ratingString: string): number {
    // Match the numeric part at the beginning of the string and convert it to a number
    const match = ratingString.match(/^[\d.]+/);
    return match ? parseFloat(match[0]) : 0; // Return 0 if the rating format is unexpected
  }
  //add to watchlist

  addToWatchlist(movieTitle: string,movieYear: number,movieRating: number) {
    
    
    const watchlistPayload = {
      // Assuming userId is available in your component
      
        movieTitle: movieTitle,
        movieYear: movieYear,
        movieRating:movieRating// Ensure this is a number (float)
      
    };

    // console.log("log in watchlist:",this.loggedInUserId);
    

    this.apiService.addToWatchlist(this.loggedInUserId,watchlistPayload).subscribe({
      next: (response) => {
        console.log('Movie added to watchlist from recommendation:', response);
        // Optionally update the UI or notify the user
        alert("movie added to watchlist")
      },
      error: (error) => {
        console.error('Error adding movie to watchlist:', error);
      },
      complete: () => {
        console.log('Watchlist operation complete.');
      }
    });
}
  
  
}
