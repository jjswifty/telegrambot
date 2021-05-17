import axios from 'axios'
require('dotenv').config();

const geocoderToken = process.env.geocoderToken

class GeocoderApi {
    geocodeByCityName = async (city: string) => {
        try {
            const { data } = await axios.get(encodeURI(`https://geocode-maps.yandex.ru/1.x/?apikey=${geocoderToken}&format=json&geocode=${city}`))
            const position = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
            
            return {
                latitude: position[1],
                longitude: position[0]
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    geocodeByCoordinates = async (latitude: number, longitude: number) => {
        try {
            const { data } = await axios.get(encodeURI(`https://geocode-maps.yandex.ru/1.x/?apikey=${geocoderToken}&format=json&geocode=${longitude},${latitude}`))
            
            return {
                location: data.response.GeoObjectCollection.featureMember[0].GeoObject.description
            }
        } catch (err) {
            throw new Error(err)
        }
    }
}

export const geocoderApi = new GeocoderApi()
const api = new GeocoderApi()

api.geocodeByCoordinates(37.622513, 55.75322)