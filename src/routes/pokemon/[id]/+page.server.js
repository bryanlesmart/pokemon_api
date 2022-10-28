


export const load = async ({ fetch , params  }) => {

    let error 

    function toTitleCase(string, splitChar) {
      return string
        .toLowerCase()
        .split(splitChar)
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    }

    const TYPE_COLORS = {
        bug: 'green',
        dark: 'orange',
        dragon: 'purple',
        electric: 'orange',
        fairy: 'pink',
        fighting: 'orange',
        fire: 'red',
        flying: 'purple',
        ghost: 'purple',
        grass: 'green',
        ground: 'yellow',
        ice: 'teal',
        normal: 'orange',
        poison: 'purple',
        psychic: 'red',
        rock: 'yellow',
        steel: 'gray',
        water: 'blue',
      }
    
      function getFlavorText(flavors) {
        // RANDOM FLAVOR TEXT
        let tempDescription = []
        tempDescription = flavors
          .filter(flavor => flavor.language.name === 'en')
          .map(item => item.flavor_text)
    
        const num = Math.floor(Math.random() * tempDescription.length)
    
        return tempDescription[num]
      }

    const getPokemonById = async (id) =>{

        const pokemonURL =  await  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        const pokemonSpeciesURL = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)

        try{
            const pokemonGeneral = await pokemonURL.json()
            const pokemonSpecies  = await pokemonSpeciesURL.json()

            const {
                name,
                types,
                sprites,
                stats,
                abilities,
                height,
                weight,
              } = pokemonGeneral

            
              const {
                flavor_text_entries,
                capture_rate,
                growth_rate,
                gender_rate,
                egg_groups,
                evolves_from_species,
                genera,
              } = pokemonSpecies

                  // POKEMON THEME (use the last type in the types array to determine)
      const pokemonTheme = TYPE_COLORS[types[types.length - 1].type.name]

      // GENDER RATIO
      const genderRate = gender_rate
      const genderRatio = {
        female: 12.5 * genderRate,
        male: 12.5 * (8 - genderRate),
      }

      //EGG GROUPS
      const eggGroups = egg_groups
        .map(group => toTitleCase(group.name, ' '))
        .join(', ')

      // ABILITIES
      const formattedAbilities = abilities
        .map(ability => toTitleCase(ability.ability.name, '-'))
        .join(', ')

      // Effort Values
      const evs = stats
        // filter out stats where effort is 0
        .filter(stat => {
          if (stat.effort > 0) {
            return true
          }
          return false
        })
        .map(stat => `${stat.effort} ${toTitleCase(stat.stat.name, '-')}`)
        .join(', ')

      // EVOLUTION
      let evolvesFrom
      if (evolves_from_species) {
        evolvesFrom = {
          name: toTitleCase(evolves_from_species.name, ' '),
          url: evolves_from_species.url.split('/')[
            evolves_from_species.url.split('/').length - 2
          ],
        }
      } else {
        evolvesFrom = undefined
      }

      const formattedStats = stats.map(stat => {
        return {
          name: toTitleCase(stat.stat.name, '-'),
          base_stat: stat.base_stat,
        }
      })

      // Species Variety
      const species = genera.filter(g => g.language.name === 'en')[0].genus

              const data  = {
                description: getFlavorText(flavor_text_entries),
                sprites,
                stats: formattedStats,
                height,
                weight,
                captureRate: capture_rate,
                growthRate: toTitleCase(growth_rate.name, '-'),
                genderRatio,
                eggGroups,
                abilities: formattedAbilities,
                evs,
                evolvesFrom,
                pokemonTheme,
                species,
                    name: toTitleCase(name, ''),
                    types: types.map(type =>({
                        name: toTitleCase(type.type.name, ''),
                        color:TYPE_COLORS[type.type.name.toLowerCase()],  
                      }))
              }
            
            return data 
            
        }catch (e){
            const serverMessage = await e.response.text()
            error = serverMessage
        }

        
    }

    
    return {
        pokemon: getPokemonById(params.id)
    }
}