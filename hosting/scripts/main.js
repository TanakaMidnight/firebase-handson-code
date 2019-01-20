'use strict'

firebase.firestore().settings({ timestampsInSnapshots: true })

import { constRestaurant } from './const.js'
import { Restaurant } from './models.js'

window.onload = function() {
  new Vue({
    el: '#app',
    data: {
      loading: true,
      noData: false,
      isLoginFirebase: false,
      isShowDetail: false,
      isShowAddRating: false,
      isShowFilter: false,
      filters: {
        city: '',
        price: '',
        category: '',
        sort: 'Rating'
      },
      restaurants: [],
      detail: {
        id: '',
        title: '',
        photo: '',
        avgRating: 0,
        category: '',
        city: '',
        numRatings: 0,
        price: 0
      },
      rating: {
        rating: '',
        comment: ''
      },
      ratings: [],
      constRestaurant: constRestaurant
    },
    watch: {
      isLoginFirebase: function(val) {
        if (val) {
          this.checkEmptyRestaunts()
        }
      }
    },
    created() {
      this.loginFirebase(this)
    },
    methods: {
      clickCreateMockData: function(e) {
        Restaurant.createMockData()
      },
      clickShowDetail: function(id) {
        const that = this
        Restaurant.getRestaurant(id).then(function(doc) {
          that.detail = { id: doc.id, ...doc.data() }
          Restaurant.getRatings(doc).then(function(ratings) {
            let retArr = []
            ratings.docs.forEach(elem => {
              retArr.push(elem.data())
            })
            that.ratings = retArr
          })
        })
        this.isShowDetail = true
      },
      clickFilter: function() {
        this.renderList()
        this.isShowFilter = false
      },
      clickShowAddRating: function() {
        this.rating = { rating: '2', comment: '' }
        this.isShowAddRating = true
      },
      clickSaveRating: function() {
        Restaurant.addRating(this.detail.id, this.rating)
        this.isShowAddRating = false
      },
      loginFirebase: function(that) {
        firebase
          .auth()
          .signInAnonymously()
          .then(function() {
            that.isLoginFirebase = true
          })
      },
      checkEmptyRestaunts: function() {
        const that = this
        const obj = Restaurant.getRestaurantLimit()
        obj.onSnapshot(function(doc) {
          if (doc.empty) {
            that.noData = true
            that.loading = false
          } else {
            that.noData = false
            that.renderList()
          }
        })
      },
      renderList: function() {
        const that = this
        Restaurant.getRestaurants(this.filters).onSnapshot(function(snapshot) {
          if (!snapshot.size) {
            that.loading = false
            return
          }
          that.restaurants = []
          snapshot.docs.forEach(elem => {
            let v = that.restaurants.push({
              id: elem.id,
              ...elem.data()
            })
          })
          snapshot.docChanges().forEach(function(change) {
            if (change.type === 'removed') {
              console.log('Removed')
            } else {
              console.log('Changed')
            }
          })
          that.loading = false
        })
      }
    }
  })
}
