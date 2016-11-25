var cors = require('cors');
var express = require('express');
var _ = require('lodash');
var Promise = require("bluebird");
import fetch from 'isomorphic-fetch';
import fs from 'fs';

const API = 'https://pokeapi.co/api/v2';
const pokemonFields = ["id","name","weight","height"]

async function getAllPokemons(url) {
    console.log('Getting:', url);
    let response = await fetch(url);
    let page = await response.json();
    return page.results
}

async function getPokemon(url) {
    let pokemon = await fetch(url);
    pokemon = await pokemon.json();
    pokemon = _.pick(pokemon, pokemonFields);
    console.log('Got:', url);
    return pokemon;
}

const loadPokemonsFromFile = () => JSON.parse(fs.readFileSync('pokemons.json'));
const loadPokemonsOnline = async () => {
    let pages = await Promise.all(_.map(_.range(0, 811, 20), offset => getAllPokemons(`${API}/pokemon/?offset=${offset}`)));
    let pokemons = await Promise.all(_.map(_.flatten(pages), pokemon => getPokemon(pokemon.url)));
    return pokemons;
}

const loadUp = async (fromOffline=true) => {
    try {
        return fromOffline ? loadPokemonsFromFile() : await loadPokemonsOnline();
        // fs.writeFileSync('db.txt', JSON.stringify(pokemons));
    }
    catch(e){
        console.log(e)
        return res.json(e)
    }
}

const getPokemonsSorted = (pokemons, ascending=true, getParamFunc) => _.map(pokemons.sort((a, b) => {
    if(typeof getParamFunc !== "function") getParamFunc = (p) => p.name;
    let paramA = getParamFunc(a);
    let paramB = getParamFunc(b);
    let cmp;

    if(paramA < paramB) 
        cmp = -1 
    else if (paramA > paramB) 
        cmp = 1
    else return a.name.localeCompare(b.name);
    return ascending ? cmp : -cmp;
}), 'name')

const getPokemonsForRequest = (pokemons, req, getParamFunc, ascending) => {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    return getPokemonsSorted(pokemons, ascending, getParamFunc).slice(offset, offset + limit);
}
 // Можно рискнуть здоровьем и попробовать поставить loadUp(false) для загрузки онлайн, но я бы не стал так делать
loadUp().then((pokemons) => {
    const app = express();
    app.use(cors());

    app.get('/task3c/', (req, res) => {
        res.send(getPokemonsForRequest(pokemons, req));
    });

    app.get('/task3c/angular', (req, res) => {
        res.send(getPokemonsForRequest(pokemons, req, p => p.weight / p.height));
    });

    app.get('/task3c/huge', (req, res) => {
        res.send(getPokemonsForRequest(pokemons, req, p => p.height, false));
    });

    app.get('/task3c/micro', (req, res) => {
        res.send(getPokemonsForRequest(pokemons, req, p => p.height));
    });

    app.get('/task3c/fat', (req, res) => {
        res.send(getPokemonsForRequest(pokemons, req, p => p.weight / p.height, false));
    });

    app.get('/task3c/heavy', (req, res) => {
        res.send(getPokemonsForRequest(pokemons, req, p => p.weight, false));
    });

    app.get('/task3c/light', (req, res) => {
        res.send(getPokemonsForRequest(pokemons, req, p => p.weight));
    });

    app.listen(3000, () => {
      console.log('Your app listening on port 3000!');
    });

})