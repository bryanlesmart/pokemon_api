

<script>
    import './main.css'
	import Navbar from "./lib/components/Navbar.svelte";


</script>


<svelte:head>
    <title>Pokedex</title>
</svelte:head>

<Navbar/>

<main>
    <slot/>
</main>