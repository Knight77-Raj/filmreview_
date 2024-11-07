import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for navigation
import { AuthService } from '../auth.service'; // Import AuthService
import { ApiService } from '../api.service';
// import { ApiService } from '../api.service';

interface NetflixItem {
  show_id: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: string;
  rating: string;
  duration: string;
}


@Component({
  selector: 'app-latestmovies',
  templateUrl: './latestmovies.component.html',
  styleUrls: ['./latestmovies.component.css']
})
export class LatestMoviesComponent implements OnInit 
{

  // latestMovies: any[] = [];
  // latestTVShows: any[] = [];
  movies: any[] = [];
  quotes: any;
  city: string = 'ncr'; // Set your city
  visibleMoviesCount: number = 4; // Initially show 6 movies
  showAllMovies: boolean = false;
  private apiKey = 'd1b50bd15e18ead693839d26baa04e4a';
  // topMovies: any[] = [];
  trendingMovies: any[] = [];
  displayedMovies: any[] = []; // Movies currently displayed
  itemsToShow: number = 4; // Number of items to show initially
  isDarkTheme: boolean = false;
  oscarWinners: any[] = [];

  //netflix data
  netflixmovies: any[] = [];
  visibleMovies: any[] = [];
  showAll: boolean = false;
  
  loggedInUserId: string = ''; // Declare the loggedInUserId property
  latestMoviesError: string | null = null; // Declare a variable to hold error messages
  latestMoviesError1: string | null = null;
  
  constructor(
    private http: HttpClient,
    // private netflixDataService: ApiService,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService

  ) {}

  

 
  ngOnInit(): void {
    // Fetch data from the Netflix data service
   
    this.fetchLatestMovies();
    // this.fetchTopMovies();
    this.fetchTrendingMovies();


    // this.apiService.getOscarWinners().subscribe((winners: any[]) => {
    //   this.oscarWinners = winners;
    // });

    this.fetchLatestIndianMovies();
    // this.loadWatchlist();

    this.loggedInUserId = this.authService.getCurrentUserId() ?? ''; // Fallback to an empty string if null
    // console.log("logged in user:",this.loggedInUserId);

    // this.apiService.getWatchlist(this.loggedInUserId)
  }
  addToWatchlist(movieTitle: string,movieYear: number, movieRating: number) {
   
    const watchlistPayload = {
      // Assuming userId is available in your component
      
        movieTitle: movieTitle,
        movieYear: movieYear,
        movieRating: movieRating // Ensure this is a number (float)
      
    };

    // console.log("log in watchlist:",this.loggedInUserId);
    

    this.apiService.addToWatchlist(this.loggedInUserId,watchlistPayload).subscribe({
      next: (response) => {
        console.log('Movie added to watchlist:', response);
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

  // fetchTopMovies() {
  //   this.apiService.getTopMovies().subscribe(
  //     (response) => {
  //       if (response && response.data) {
  //         // Extract the 'data' array from the response and assign it to topMovies
  //         this.topMovies = response.data;
  //       } else {
  //         console.error('Invalid response format', response);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching top movies', error);
  //     }
  //   );
  // }

  //watchlist
  // loadWatchlist() {
  //   this.apiService.getWatchlist(this.loggedInUserId!).subscribe({
  //     next: (movies) => {
  //       this.watchlistMovies = movies;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching watchlist:', error); // Handle error
  //     },
  //     complete: () => {
  //       console.log('Watchlist loaded successfully'); // Optional: Do something when complete
  //     }
  //   });
  // }
  




//netflix movies
  fetchLatestIndianMovies() {
    this.apiService.getLatestIndianMovies().subscribe({
      next: (response) => {
        this.netflixmovies = response.results; // Assuming the response has a results array
        this.visibleMovies = this.netflixmovies.slice(0, 4); // Show the first 4 movies
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
        if (error.status === 504) {
          this.latestMoviesError = 'Latest movies in theatre feature is not available currently.';
        }
        else if (error.message.includes('ERR_SSL_PROTOCOL_ERROR')) {
          this.latestMoviesError = 'Failed to load the feature due to a security protocol error. Please try again later.';
        } else {
          this.latestMoviesError = 'An error occurred while fetching movies.';
        }
      }
    });
  }
  

  handleSeeMore() {
    this.showAll = true; // Show all movies
    this.visibleMovies = this.netflixmovies; // Display all movies
  }

  handleSeeLess(): void {
    this.visibleMovies = this.netflixmovies.slice(0, 4); // Show only the first 4 movies
    this.showAll = false; // Set flag to false
  }
  
  fetchTrendingMovies() {
    const topic = 'entertainment';
    const language = 'en';
    const country = 'in';
    this.apiService.getTrendingNews(topic, language, country).subscribe({
      next: (response) => {
        // Handle successful response
        console.log('API Response:', response); // Log the API response
        if (response.success) {
          this.trendingMovies = response.data; // Correctly access the 'data' property
          this.displayedMovies = this.trendingMovies.slice(0, this.itemsToShow); // Show first 4 movies initially
        } else {
          console.error('API call was not successful');
        }
      },
      error: (error) => {
        console.error('Error fetching trending movies:', error);
      }
    });
    
  }
//this is news section
  // loadMore() {
  //   const nextItems = this.trendingMovies.slice(this.displayedMovies.length, this.displayedMovies.length + this.itemsToShow);
  //   this.displayedMovies = this.displayedMovies.concat(nextItems); // Append next set of movies
  // }


  // fetchLatestMovies(): void {
  //   const apiUrl = `/api/${this.city}/event`; // Use /api to trigger the proxy
  
  //   this.http.get(apiUrl).subscribe({
  //     next: (data: any) => {
  //       this.movies = data; // Assuming data contains the movie list
  //       console.log('Movies fetched:', this.movies);
  //     },
  //     error: (err) => console.error('Error fetching movies:', err)
  //   });
  // }


  
  fetchLatestMovies(): void {
    const apiUrl = `/api/movie/now_playing?api_key=${this.apiKey}&language=en-IN&region=IN&page=1`;
  
    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        this.movies = data.results; // Assuming 'results' contains the list of movies
        console.log('Movies fetched:', this.movies);
      },
      error: (err) => {
        console.error('Error fetching movies:', err)
        if (err.status === 504) {
          this.latestMoviesError1 = 'Latest  theatre movie feature is not available currently.';
        }
        else if (err.message.includes('ERR_SSL_PROTOCOL_ERROR')) {
          this.latestMoviesError1 = 'Failed to load the feature due to a security protocol error. Please try again later.';
        } else {
          this.latestMoviesError1 = 'An error occurred while fetching movies.';
        }
      }
      
    });
  }
  
  goToReviewForm(movieTitle: string): void {
    this.router.navigate(['/reviewform', movieTitle]); // Navigate to the review form with the movie title
  }

// Redirect to BookMyShow booking page
bookTicket(movie: any): void {
  //const city = this.getCityFromIP();
  //const encodedTitle = encodeURIComponent(movie.title); // Assuming movie has a title field
  const searchUrl = `https://in.bookmyshow.com/explore/movies`;
;
  // Replace X with actual movie identifier
  window.open(searchUrl, '_blank'); // Opens the booking page in a new tab
}

  toggleMovies(): void {
    this.showAllMovies = !this.showAllMovies;  // Toggle between showing all movies and only the first 6
    this.visibleMoviesCount = this.showAllMovies ? this.movies.length : 4; // Adjust movie count based on the toggle state
  }

}
// showAvailability: any;

// constructor(private apiService: ApiService) {}

// ngOnInit(): void {
//   const type = 'movie'; // or 'tv' based on what you want to check
//   const id = '12345'; // Replace with actual show ID

//   this.apiService.getShowAvailability(type, id).subscribe({
//     next: (data) => {
//       this.showAvailability = data;
//       console.log('Show Availability:', this.showAvailability);
//     },
//     error: (error) => {
//       console.error('Error fetching show availability:', error);
//     }
//   });



 

