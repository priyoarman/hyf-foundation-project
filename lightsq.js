import knexLibrary from "knex";

const dbFile = " memory_game.sqlite3"; // Update path if needed

const knex = knexLibrary({
    client: "sqlite3",
    connection: {
        filename: dbFile,
    },
    useNullAsDefault: true,
});

async function getAllNamesAndUrls() {
    try {
        const results = await knex.select("name", "url").from("cards");
        console.log("Names and URLs:", results);
        return results;
    } catch (err) {
        console.error("Error fetching names and urls:", err);
        return [];
    } finally {
        await knex.destroy();
    }
}

getAllNamesAndUrls();
