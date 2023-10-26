const mongoose = require("mongoose")
const Restaurant = require("../models/restaurant")
const User = require("../models/user")

// create a restaurant
async function createRestaurant(restaurant) {
    try {
        const newRestaurant = new Restaurant(restaurant)
        const saveRestaurant = await newRestaurant.save();
        if (saveRestaurant) {
            console.log("New restaurant added ", saveRestaurant)
        } else {
            console.log("New restaurant not created")
        }
    } catch (error) {
        console.log("Failed to add new restaurant ", error)
    }
}

// read a restaurant
async function readRestaurant(restaurantName) {
    try {
        const restaurant = await Restaurant.findOne({ name: restaurantName })
        if (restaurant) {
            console.log("Restaurant found ", restaurant)
        } else {
            console.log(`No restaurant found with name ${restaurantName}`)
        }
    } catch (error) {
        console.log(`Failed to retrieve restaurant ${restaurantName} `, error)
    }
}

// read all restaurants
async function readAllRestaurants() {
    try {
        const restaurants = await Restaurant.find()
        if (restaurants) {
            console.log("All restaurants ", restaurants)
        } else {
            console.log("No restaurants found")
        }
    } catch (error) {
        console.log("Failed to retrieve all restaurants ", error)
    }
}

// read restaurants by cuisine
async function readRestaurantsByCuisine(cuisine) {
    try {
        const restaurants = await Restaurant.find({ cuisine: cuisine })
        if (restaurants.length > 0) {
            console.log(`Restaurants with cuisine ${cuisine} `, restaurants)
        } else {
            console.log(`No restaurants with cuisine ${cuisine}`)
        }
    } catch (error) {
        console.log(`Failed to retrieve all restaurants with cuisine ${cuisine} `, error)
    }
}

// update a restaurant by ID
async function updateRestaurant(restaurantId, updatedRestaurant) {
    try {
        const restaurant = await Restaurant.findById({ _id: restaurantId })
        if (restaurant) {
            restaurant.set(updatedRestaurant)
            await restaurant.save()
            console.log("Updated restaurant ", restaurant)
        } else {
            console.log(`Cannot find restaurant to update`)
        }
    } catch (error) {
        console.log("Failed to update the restaurant ", error);
    }
}

// delete a restaurant by ID
async function deleteRestaurant(restaurantID) {
    try {
        const restaurant = await Restaurant.findOneAndDelete({ _id: restaurantID })
        if (restaurant) {
            console.log(`Deleted restaurant ${restaurant.name}`)
        } else {
            console.log('No restaurant found to delete')
        }
    } catch (error) {
        console.log("Failed to delete the restaurant ", error)
    }
}

// search restaurants by location
async function searchRestaurantsByLocation(restaurantLocation) {
    try {
        //location can be city or address
        const restaurants = await Restaurant.find({
            $or: [
                { 'city': restaurantLocation },
                { 'address': restaurantLocation }
            ]
        })

        if (restaurants.length > 0) {
            console.log(`Restaurants present at location ${restaurantLocation} `, restaurants)
        } else {
            console.log(`No restaurants found with location ${restaurantLocation}`)
        }
    } catch (error) {
        console.log("Failed to find the restaurants ", error)
    }
}

// filter restaurants by rating
async function filterRestaurantsByRating(restaurantRating) {
    try {
        const restaurants = await Restaurant.find({ rating: { $gte: restaurantRating } })
        if (restaurants.length > 0) {
            console.log(`Restaurants with minimum rating greater than ${restaurantRating} `, restaurants)
        } else {
            console.log(`No restaurants find with ratings greater than ${restaurantRating}`)
        }
    } catch (error) {
        console.log("Failed to filter restaurants by rating ", error)
    }
}

// add a dish to restaurant's menu
async function addDishToMenu(restaurantID, dishToAdd) {
    try {
        const restaurant = await Restaurant.findOne({ _id: restaurantID })
        if (restaurant) {
            restaurant.menu.push(dishToAdd);
            await restaurant.save();
            console.log(`Added dish to the restaurant successfully `, restaurant);
        } else {
            console.log(`No restaurant found`)
        }
    } catch (error) {
        console.log('Failed to add dish to the restaurant ', error)
    }
}

// remove a dish from restaurant's menu
async function removeDishFromMenu(restaurantID, dishName) {
    try {
        const restaurant = await Restaurant.findOne({ _id: restaurantID })
        if (restaurant) {
            const selectDish = restaurant.menu.find((dish) => dish.name === dishName)
            if (selectDish) {
                restaurant.menu = restaurant.menu.filter((dish) => dish.name !== dishName)
                await restaurant.save();
                console.log(`Dish ${dishName} removed from the menu successfully `, restaurant)
            } else {
                console.log(`No dish found with name ${dishName} in the restaurant ${restaurant.name}`)
            }
        } else {
            console.log(`No restaurant found`)
        }
    } catch (error) {
        console.log("Failed to remove dish from restaurant ", error)
    }
}


//add a user review and rating for a restaurant
async function addUserReviewAndRating(userID, restaurantID, reviewText, reviewRating) {
    try {
        const restaurant = await Restaurant.findById(restaurantID)
        const user = User.findById(userID)
        if (restaurant && user) {
            const review = {
                user: userID,
                text: reviewText,
                rating: reviewRating
            }
            restaurant.reviews.push(review)
            await restaurant.save()

            console.log(`Added review and rating successfully `, restaurant)

            const populateRestaurant = await restaurant.populate({ path: 'reviews.user', select: 'usernam profilePictureUrl' })

            console.log(`Successfully populated the review for the restaurant ${restaurant.name} `, populateRestaurant)
        } else {
            console.log("Wrong restaurant or user")
        }
    } catch (error) {
        console.log(`Failed to add review and rating to the restaurant `, error)
    }
}

// retrieve user reviews for a restaurant
async function getUserReviewsForRestaurant(restaurantId) {
    try {
        const restaurant = await Restaurant.findById(restaurantId)
        if (restaurant) {
            const populateRestaurant = await restaurant.populate({ path: 'reviews.user', select: 'usernam profilePictureUrl' })
            console.log(`Reviews for the restaurant ${restaurant.name} `, populateRestaurant.reviews)
        } else {
            console.log('No restaurant found')
        }
    } catch (error) {
        console.log('Failed to retrieve reviews for the restaurant ', error);
    }
}

module.exports = {
    createRestaurant,
    readRestaurant,
    readAllRestaurants,
    readRestaurantsByCuisine,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurantsByLocation,
    filterRestaurantsByRating,
    addDishToMenu,
    removeDishFromMenu,
    addUserReviewAndRating,
    getUserReviewsForRestaurant
};


