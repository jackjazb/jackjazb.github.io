import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { execSync } from "child_process";

export default function (eleventyConfig) {

    // Set up syntax highlighting.
    eleventyConfig.addPlugin(syntaxHighlight);

    // Copy image directory.
    eleventyConfig.addPassthroughCopy("src/img/**");
    eleventyConfig.addPassthroughCopy("src/css/**");

    // Add global layout.
    eleventyConfig.addGlobalData("layout", "base.liquid");

    // Add current year (for copyright).
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Set up RSS.
    eleventyConfig.addPlugin(feedPlugin, {
        type: "rss",
        outputPath: "/feed.xml",
        collection: {
            name: "blog",
            limit: 0, // This means no limit.
        },
        metadata: {
            language: "en",
            title: "Jack Jazrawy-Brown",
            subtitle: "This is a longer description about your blog.",
            base: "https://example.com/",
            author: {
                name: "Jack Jazrawy-Brown",
                email: "jackjazb@gmail.com",
            }
        }
    });

    // Tailwind build step.
    eleventyConfig.on('eleventy.before', async ({ dir }) => {
        // Bit of a hack, but I think this is the best way to get it to do file watching.
        try {
            execSync(`npx @tailwindcss/cli -i ./src/main.css -o ./${dir.output}/main.css`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error building CSS:`, error);
        }
    });
    return {
        dir: {
            input: 'src',
            layouts: 'layouts',
            output: '_site'
        }
    };
};

