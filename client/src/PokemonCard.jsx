import { Badge, Card, Flex, Kbd, Strong, Text } from "@radix-ui/themes";

export default function PokemonCard({ data }) {
    return (
        <Card style={{ backgroundColor: "black" }}>
            <Flex direction="column" gap="2">
                <Flex direction="row" justify="between">
                    <Text style={{textTransform: "capitalize"}}>
            <Strong>{data.name}</Strong>
                    </Text>
            <Kbd>{data.id}</Kbd>
                </Flex>

                <img
                    src={data.sprites?.front_default}
                    alt={data.name}
                    style={{
                        display: "block",
                        objectFit: "contain",
                        width: "100%",
                        height: 140,
                        backgroundColor: "#ffffff",
                    }}
                />

                <Flex direction="row" gap="1">
                    {data.types.slice(0, 4).map((typeData) => (
                        <Badge>{typeData.type.name}</Badge>
                    ))}
                </Flex>

        {data.abilities.slice(0, 4).map((abilityData) => (
            <Flex direction="column" gap="1">
            <Text size="2">
                <Strong>{abilityData.names.find((name) => name.language.name === "en").name}</Strong>
            </Text>
            <Text size="1">{abilityData.effect_entries.find((entry) => entry.language.name === "en")?.short_effect ?? "No description"}</Text>
            </Flex>
        ))}
            </Flex>
        </Card>
    );
}
