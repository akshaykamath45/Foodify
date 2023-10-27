const mongoose = require("mongoose");
const express = require("express");
require("./db")
const Restaurant = require("./models/restaurant");
const { createRestaurant, readRestaurant, readAllRestaurants, readRestaurantsByCuisine, updateRestaurant, deleteRestaurant, searchRestaurantsByLocation, filterRestaurantsByRating, addDishToMenu, removeDishFromMenu, addUserReviewAndRating, getUserReviewsForRestaurant } = require("./controllers/restaurantController");

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("Foodify Restaurant API")
})

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
})

// creating a restaurant API
app.post("/restaurants", async (req, res) => {
    try {
        const restaurant = await createRestaurant(req.body);
        if (restaurant) {
            res.json({ message: "Restaurant added successfully", restaurant: restaurant })
        } else {
            res.status(401).json({ error: "Cannot add restaurant" })
        }
    } catch (error) {
        res.json.status(500).json({ error: "Failed to add restaurant" })
    }
})

// searching for restaurants by location
app.get("/restaurants/search", async (req, res) => {
    const { location } = req.query
    console.log(location)
    try {
        const restaurant = await searchRestaurantsByLocation(location)
        if (restaurant) {
            res.json({ message: `Restaurants found in ${location}`, restaurant: restaurant })
        } else {
            res.status(404).json({ error: `No restaurants found in location ${location}` })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to search restaurants" })
    }
})

// filtering restaurants by rating
app.get("/restaurant/rating/:minRating", async (req, res) => {
    const { minRating } = req.params
    try {
        const restaurants = await filterRestaurantsByRating(minRating)
        if (restaurants) {
            res.json({ message: `Restaurants with minimum rating ${minRating}`, restaurants: restaurants })
        } else {
            res.status(404).json({ error: `No restaurants found with minimum rating ${minRating}` })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to filter restaurants" })
    }
})

// adding a dish to restaurant's menu
app.post("/restaurants/:restaurantId/menu", async (req, res) => {
    const { restaurantId } = req.params;
    const { dishToAdd } = req.body
    try {
        const restaurant = await addDishToMenu(restaurantId, dishToAdd);
        if (restaurant) {
            res.json({ message: `Dish ${dishToAdd.name} added succesfully to the restaurant ${restaurant.name} `, restaurant: restaurant })
        } else {
            res.status(404).json({ error: "No restaurant found to add dish" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to add dish to the restaurant" })
    }

})

// removing a dish from restaurant's menu
app.delete("/restaurants/:restaurantId/menu/:dishName", async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { dishName } = req.params;
        const restaurant = await removeDishFromMenu(restaurantId, dishName)
        if (restaurant) {
            res.json({ message: `Removed dish ${dishName} from the restaurant ${restaurant.name} successfully `, restaurant: restaurant })
        } else {
            res.status(404).json({ error: "No dish present or wrong restaurant" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete the dish from restaurnat's menu" })
    }
})

// allowing users to add reviews and rating for restaurant
app.post("/restaurants/:restaurantId/reviews", async (req, res) => {

    const { restaurantId } = req.params
    const { userId, rating, reviewText } = req.body
    try {
        const restaurant = await addUserReviewAndRating(userId, restaurantId, reviewText, rating)
        if (restaurant) {
            res.json({ message: `Successfully added review to the restaurant ${restaurant.name} `, restaurant: restaurant })
        } else {
            res.status(404).json({ error: "Cannot add review to the restaurant,Please check userId and restaurantId" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to add user review and rating to the restaurant" })
    }
})

//reading a restaurant API
app.get("/restaurants/:name", async (req, res) => {
    try {
        const restaurant = await readRestaurant(req.params.name);
        if (restaurant) {
            res.json({ message: "Restaurant found", restaurant: restaurant })
        } else {
            res.status(401).json({ error: `No restaurant found with name ${req.params.name}` })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to read restaurant" })
    }
})

//reading all restaurants API
app.get("/restaurants", async (req, res) => {
    try {
        const restaurants = await readAllRestaurants()
        if (restaurants) {
            res.json({ message: "All restaurants fetched successfully", restaurants: restaurants })
        } else {
            res.status(401).json({ error: "Cannot fetch restaurants" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch restaurants" })
    }
})

//reading restaurants by cuisine API
app.get("/restaurants/cuisine/:cuisineType", async (req, res) => {
    const cuisine = req.params.cuisineType
    try {
        const restaurants = await readRestaurantsByCuisine(req.params.cuisineType);
        if (restaurants) {
            res.json({ message: `All restaurants with ${cuisine} cuisine fetched successfully`, restaurants: restaurants })
        } else {
            res.status(401).json({ error: `No restaurants found with ${cuisine} cuisine ` })
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch restaurants with cuisine ${cuisine}` })
    }
})


//updating a restaurant API
app.post("/restaurants/:restaurantId", async (req, res) => {
    try {
        const restaurant = await updateRestaurant(req.params.restaurantId, req.body)
        if (restaurant) {
            res.json({ message: "Restaurant updated successfully", restaurant: restaurant })
        } else {
            res.status(404).json({ error: "No restaurant found to update " })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update the restaurant" })
    }
})

//deleting a restaurant API
app.delete("/restaurants/:restaurantId", async (req, res) => {
    try {
        const restaurant = await deleteRestaurant(req.params.restaurantId)
        if (restaurant) {
            res.json({ message: "Restaurant deleted successfully", restaurant: restaurant })
        } else {
            res.status(404).json({ error: "No restaurant found to delete" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete the restaurant" })
    }
})

