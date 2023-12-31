const menu = require("../../models/menu")

const homeController = () => {
    return {
        index: async (req, res) => {
            try {

                const pizzas = await menu.find();
                res.render("home", pizzas ? { pizzas: pizzas } : { pizzas: [] })
            } catch (error) {
                console.log("error => ", error);
            }
        }

    }
}

module.exports = homeController