import { gql } from 'apollo-server-core';

export const typeDefs = gql`

    type CoreUnit {
        "id is autogenerated in the database"
        id: ID!
        "Core Unit code - as defined within the Core Units' MIP39"
        code: String
        "Core Unit name - as as defined within the Core Units' MIP39"
        name: String
        "Logo image reference to swarm network. In case server is down, copy file reference and paste it in another swarm gateway link"
        image: String
        "Type of core unit"
        category: [CoreUnitCategory]
        sentenceDescription: String
        paragraphDescription: String
        paragraphImage: String
        shortCode: String
        "Access details on MIPs 39/40/41 of a Core Unit"
        cuMip: [CuMip]
        "Access details on the budget statements of a Core Unit"
        budgetStatements: [BudgetStatement]
        "Access details on the social media channels of a Core Unit"
        socialMediaChannels: [SocialMediaChannels]
        "Work basis of the FTE's within a Core Unit, use this field to access details of the FTE's contributing to a Core Unit"
        contributorCommitment: [ContributorCommitment]
        "Access details on the relevant GitHub contributions of a Core Unit"
        cuGithubContribution: [CuGithubContribution]
        "Access details on the roadmap (work performed and planned) of a Core Unit"
        roadMap: [Roadmap]
    }

    enum CoreUnitCategory {
        Technical
        Support
        Operational
        Business
        RWAs
        Growth
        Finance
        Legal
    }

    type CoreUnitPayload {
        errorrs: [Error!]!
        coreUnit: CoreUnit
    }

    extend type Query {
        "Use this query to retrieve information about ALL Core Units"
        coreUnits(limit: Int, offset: Int): [CoreUnit],
        "Use this query to retrieve information about a single Core Unit, use arguments to filter."
        coreUnit(filter: CoreUnitFilter): [CoreUnit],
    }

    # Using form <model>Action e.g. coreUnitAdd for better grouping in the API browser
    # type Mutation {
        # "Add a Core Unit to the database"
        # coreUnitAdd(input: CoreUnitInput!): CoreUnitPayload!
        # "Delete a Core Unit from the database"
        # coreUnitDelete: ID!
    # }

    input CoreUnitInput {
        code: String!
        name: String!
    }

    input CoreUnitFilter {
        id: ID
        code: String
        name: String
        shortCode: String
    }

`;

export const resolvers = {
    Query: {
        // coreUnits: (parent, args, context, info) => {}
        coreUnits: async (_, filter, { dataSources }) => {
            const result = await dataSources.db.getCoreUnits(filter.limit, filter.offset)
            const parsedResult = result.map(cu => {
                if (cu.category !== null) {
                    const cleanCategory = cu.category.slice(1, cu.category.length - 1)
                    cu.category = cleanCategory.split(',');
                    return cu;
                } else {
                    return cu;
                }
            })
            return parsedResult;
        },
        coreUnit: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            const result = await dataSources.db.getCoreUnit(paramName, paramValue)
            const parsedResult = result.map(cu => {
                if (cu.category !== null) {
                    const cleanCategory = cu.category.slice(1, cu.category.length - 1)
                    cu.category = cleanCategory.split(',');
                    return cu;
                } else {
                    return cu;
                }
            })
            return parsedResult;
        }
    },
    CoreUnit: {
        budgetStatements: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getBudgetStatements();
            const budgetStatements = result.filter(statement => {
                return statement.cuId === id;
            })
            return budgetStatements;
        },
        cuMip: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getMips();
            const cuMips = result.filter(cuMip => {
                return cuMip.cuId === id;
            })
            return cuMips;
        },
        socialMediaChannels: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getSocialMediaChannels();
            const socialMediaChannels = result.filter(coreUnit => {
                return coreUnit.cuId === id;
            })
            return socialMediaChannels;
        },
        contributorCommitment: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getContributorCommitments();
            const contributorCommitments = result.filter(commitment => {
                return commitment.cuId === id;
            })
            return contributorCommitments;
        },
        cuGithubContribution: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getCuGithubContributions();
            const githubContributions = result.filter(contribution => {
                return contribution.cuId === id;
            })
            return githubContributions;
        },
        roadMap: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getRoadmaps();
            const roadmaps = result.filter(roadmap => {
                return roadmap.ownerCuId === id;
            })
            return roadmaps;
        }
    },
    // Mutation: {
    //     coreUnitAdd: async (_, { input }, { dataSources }) => {
    //         let errors;
    //         let coreUnit;
    //         // try {
    //         //     await dataSources.db.addCoreUnit(input.code, input.name)
    //         //     coreUnit = await dataSources.db.getCoreUnit('code', input.code)
    //         //     return { errors, coreUnit: coreUnit[0] }
    //         // } catch (error) {
    //         //     errors = error
    //         //     return { errors, coreUnit: '' }
    //         // }
    //     },

    //     coreUnitDelete: async (_, __, { }) => {
    //         return null;
    //     }

    // }
};