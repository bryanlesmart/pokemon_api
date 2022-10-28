
<script>
	import PokemonCard from './../lib/components/PokemonCard.svelte';
    export let data 
    const { pokemons } = data

    let searchTerm = "" 
    let filteredItems = []

    $: {
    if(searchTerm){
        filteredItems = pokemons.filter( pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    else {
        filteredItems = [...pokemons];
    }
}

</script>


<div class="px-8 mt-20">
    <h1 class="text-4xl text-center my-8 uppercase ">SvelteKit Pokedex</h1>
    <input class="w-full rounded-md text-lg p-4 border-2 mb-20 border-gray-200" bind:value={searchTerm} placeholder="Search Pokemon">
    <div class="grid grid-cols-4 gap-4">
        {#each filteredItems as pokemon}
            <PokemonCard {pokemon}/>
        {/each}
    </div>
</div>
