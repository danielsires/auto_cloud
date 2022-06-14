const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLList,
    GraphQLEnumType,
} = require('graphql')

// Mongoose Models
const Driver = require('../models/Driver')
const Vehicle = require('../models/Vehicle')

// GraphQL Types

// Driver Type
const DriverType = new GraphQLObjectType({
    name: 'Driver',
    fields: () => ({
        id: {
            type: GraphQLID,
        },
        firstName: {
            type: GraphQLString,
        },
        lastName: {
            type: GraphQLString,
        },
        phone: {
            type: GraphQLString,
        },
    }),
})

// Vehicle Type
const VehicleType = new GraphQLObjectType({
    name: 'Vehicle',
    fields: () => ({
        id: {
            type: GraphQLID,
        },
        make: {
            type: GraphQLString,
        },
        model: {
            type: GraphQLString,
        },
        year: {
            type: GraphQLString,
        },
        condition: {
            type: new GraphQLEnumType({
                name: 'Condition',
                values: {
                    New: { value: 'New' },
                    Used: { value: 'Used' },

                }
            }),

        },
        driver: {
            type: DriverType,
            resolve(parent, args) {
                return Driver.findById(parent.driverId)
            }
        }
    })
})

// Read
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        driver: {
            type: DriverType,
            args: {
                id: {
                    type: GraphQLID,
                }
            },
            resolve(parent, args) {
                return Driver.findById(args.id)
            }
        },
        vehicle: {
            type: VehicleType,
            args: {
                id: {
                    type: GraphQLID,
                }
            },
            resolve(parent, args) {
                return Vehicle.findById(args.id)
            }
        },
        drivers: {
            type: new GraphQLList(DriverType),
            resolve(parent, args) {
                return Driver.find({})
            }
        },
        vehicles: {
            type: new GraphQLList(VehicleType),
            resolve(parent, args) {
                return Vehicle.find({})
            }
        }
    }
})

// Create Update Delete
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDriver: {
            type: DriverType,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                lastName: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                phone: {
                    type: new GraphQLNonNull(GraphQLString),
                }
            },
            resolve(parent, args) {
                const driver = new Driver({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    phone: args.phone,
                })
                return driver.save()
            }
        },
        addVehicle: {
            type: VehicleType,
            args: {
                make: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                model: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                year: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                condition: {
                    type: new GraphQLEnumType({
                        name: 'VehicleCondition',
                        values: {
                            New: { value: 'New' },
                            Used: { value: 'Used' },
                        }
                    }),


                },
                driverId: {
                    type: new GraphQLNonNull(GraphQLID),
                }
            },
            resolve(parent, args) {
                const vehicle = new Vehicle({
                    make: args.make,
                    model: args.model,
                    year: args.year,
                    condition: args.condition,
                    driverId: args.driverId,
                })
                return vehicle.save()
            }
        },
        updateDriver: {
            type: DriverType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
                firstName: {
                    type: GraphQLString,
                },
                lastName: {
                    type: GraphQLString,
                },
                phone: {
                    type: GraphQLString,
                }
            },
            resolve(parent, args) {
                return Driver.findByIdAndUpdate(args.id, {
                    $set: {
                        firstName: args.firstName,
                        lastName: args.lastName,
                        phone: args.phone,
                    }
                }, { new: true })
            }
        },
        updateVehicle: {
            type: VehicleType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
                make: {
                    type: GraphQLString,
                },
                model: {
                    type: GraphQLString,
                },
                year: {
                    type: GraphQLString,
                },
                condition: {
                    type: new GraphQLEnumType({
                        name: 'UpdateVehicleCondition',
                        values: {
                            New: { value: 'New' },
                            Used: { value: 'Used' },
                        }
                    }),

                },
                driverId: {
                    type: GraphQLID,

                }
            },
            resolve(parent, args) {
                return Vehicle.findByIdAndUpdate(args.id, {
                    $set: {
                        make: args.make,
                        model: args.model,
                        year: args.year,
                        condition: args.condition,
                        driverId: args.driverId,
                    }
                }, { new: true })
            }
        },
        deleteDriver: {
            type: DriverType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                }
            },
            resolve(parent, args) {
                Driver.find({ driverId: args.id }).then(vehicles => {
                    vehicles.forEach(vehicle => {
                        vehicle.remove()
                    })
                })
                return Driver.findByIdAndRemove(args.id)
            }
        },
        deleteVehicle: {
            type: VehicleType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                }
            },
            resolve(parent, args) {
                return Vehicle.findByIdAndRemove(args.id)
            }
        }
    }
})



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

