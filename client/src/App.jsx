import { Flex, Box, TextField, IconButton, Spinner, Callout } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

function App() {
    const [pokemonId, setPokemonId] = useState(6);

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function onSubmit() {
        if (isLoading) return;

        setIsLoading(true);
    setData(null);
    setError(null);

        fetch(`http://localhost:4000/api/${pokemonId}`)
            .then(async (response) => {
        const data = await response.json();
        if (response.ok) setData(data)
        else throw new Error(data.error)
      })
            .catch((error) => setError(error))
            .finally(() => setIsLoading(false));
    }

  useEffect(onSubmit, []);

    return (
        <Box maxWidth="240px" m="4">
            <Flex direction="column" gap="2">
                <Flex direction="row" gap="2">
                    <TextField.Root
                        placeholder="Pokemon ID"
                        type="number"
                        value={pokemonId}
                        onChange={(e) => setPokemonId(e.target.value)}
            disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSubmit();
                            }
                        }}
                    />
                    <IconButton onClick={onSubmit} disabled={isLoading}>
                        <MagnifyingGlassIcon width="18" height="18" />
                    </IconButton>
                </Flex>

                {!!isLoading && <Spinner />}
                {!!data && <PokemonCard data={data} />}
                {!!error && (
                    <Callout.Root color="red">
                        <Callout.Text>{error.message}</Callout.Text>
                    </Callout.Root>
                )}
            </Flex>
        </Box>
    );
}

export default App;
