import { gql } from 'apollo-server-core';

export const typeDefs = gql`

    type BudgetStatement {
        "Auto generated id field"
        id: ID!
        "Auto generated id field from Core Unit table"
        cuId: ID!
        "Month of corresponding budget statement"
        month: String!
        "Optional comments field"
        comments: String
        "Status of the budgest statement (Draft/Final)"
        budgetStatus: BudgetStatus
        "Link to the complete publication of the budget statement"
        publicationUrl: String!
        "Core Unit code as defined with the Core Units' MIP39"
        cuCode: String!
        "Number of full-time employees in the corresponding budget statement"
        budgetStatementFTEs: [BudgetStatementFTEs]
        "Details on the amount of MKR vested in the corresponding budget statement"
        budgetStatementMKRVest: [BudgetStatementMKRVest]
        "Details on the wallets used for budget statement wallets"
        budgetStatementWallet: [BudgetStatementWallet]
    }

    enum BudgetStatus {
        Final
        Draft
        SubmittedToAuditor
        AwaitingCorrections
    } 

    type BudgetStatementFTEs {
        id: ID!
        budgetStatementId: ID
        month: String
        "Full-time employees"
        ftes: Float
    }

    type BudgetStatementMKRVest {
        id: ID!
        budgetStatementId: ID!
        vestingDate: String!
        "Current MKR amount"
        mkrAmount: Float
        "Previous MKR amount"
        mkrAmountOld: Float
        comments: String
    }

    type BudgetStatementWallet {
        id: ID!
        budgetStatementId: ID!
        "Wallet name"
        name: String
        "Wallet address"
        address: String
        "Current wallet balance (as defined within the budget statement"
        currentBalance: Float
        topupTransfer: Float
        comments: String
        "Retrieve breakdown of the line items that make up the corresponding budget statement"
        budgetStatementLineItem(offset: Int, limit: Int): [BudgetStatementLineItem]
        "Retrieve payment information for corresponding budget statement"
        budgetStatementPayment: [BudgetStatementPayment]

    }

    type BudgetStatementLineItem {
        id: ID!
        budgetStatementWalletId: ID!
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: String
        headcountExpense: Boolean
    }

    type BudgetStatementPayment {
        id: ID!
        budgetStatementWalletId: ID!
        transactionDate: String!
        transactionId: String
        budgetStatementLineItemId: Int
        comments: String
    }

    type BudgetStatementPayload {
        errors: [Error]
        budgetStatement: [BudgetStatement]
    }

    input BudgetStatementInput {
        cuId: ID
        cuCode: String
        month: String
        comments: String
        budgetStatus: BudgetStatus
        publicationUrl: String
    }

    input BudgetStatementFilter {
        id: ID
        cuId: ID
        month: String
        comments: String
        budgetStatus: BudgetStatus
        publicationUrl: String
        cuCode: String
    }

    input BudgetStatementFTEsFilter {
        id: ID
        budgetStatementId: ID
        month: String
        ftes: Float
    }

    input BudgetStatementMKRVestFilter {
        id: ID
        budgetStatementId: ID
        vestingDate: String
        mkrAmount: Float
        mkrAmountOld: Float
        comments: String
    }

    input BudgetStatementWalletFilter {
        id: ID
        budgetStatementId: ID
        name: String
        address: String
        currentBalance: Float
        topupTransfer: Float
        comments: String
    }

    input BudgetStatementLineItemFilter {
        id: ID
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
    }

    input BudgetStatementPaymentFilter {
        id: ID
        budgetStatementWalletId: ID
        transactionDate: String
        transactionId: String
        budgetStatementLineItemId: Int
        comments: String
    }

    extend type Query {
        budgetStatement(filter: BudgetStatementFilter): [BudgetStatement]
        budgetStatements(limit: Int, offset: Int): [BudgetStatement!]
        budgetStatementFTEs: [BudgetStatementFTEs]
        budgetStatementFTE(filter: BudgetStatementFTEsFilter): [BudgetStatementFTEs]
        budgetStatementMKRVests: [BudgetStatementMKRVest]
        budgetStatementMKRVest(filter: BudgetStatementMKRVestFilter): [BudgetStatementMKRVest]
        budgetStatementWallets: [BudgetStatementWallet]
        budgetStatementWallet(filter: BudgetStatementWalletFilter): [BudgetStatementWallet]
        budgetStatementLineItems(limit: Int, offset: Int): [BudgetStatementLineItem]
        budgetStatementLineItem(filter: BudgetStatementLineItemFilter): [BudgetStatementLineItem]
        budgetStatementPayments: [BudgetStatementPayment]
        budgetStatementPayment(filter: BudgetStatementPaymentFilter): [BudgetStatementPayment]
    }

    type Mutation {
        budgetStatementAdd(input: BudgetStatementInput): BudgetStatementPayload!
        budgetStatementsBatchAdd(input: [BudgetStatementBatchAddInput]): [BudgetStatement]
        budgetLineItemsBatchAdd(input: [LineItemsBatchAddInput]): [BudgetStatementLineItem]
        budgetLineItemsBatchUpdate(input: [LineItemsBatchUpdateInput]): [BudgetStatementLineItem]
        budgetLineItemsBatchDelete(input: [LineItemsBatchDeleteInput]): [BudgetStatementLineItem]
        budgetStatementDelete: ID!
        budgetStatementWalletBatchAdd(input: [BudgetStatementWalletBatchAddInput]): [BudgetStatementWallet]
    }

    input LineItemsBatchAddInput {
        budgetStatementWalletId: ID!
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: String
        headcountExpense: Boolean
    }

    input LineItemsBatchUpdateInput {
        id: ID
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: String
        headcountExpense: Boolean
    }

    input LineItemsBatchDeleteInput {
        id: ID
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: String
        headcountExpense: Boolean
    }

    input BudgetStatementBatchAddInput {
        cuId: ID
        month: String
        comments: String
        budgetStatus: BudgetStatus
        publicationUrl: String
        cuCode: String
    }

    input BudgetStatementWalletBatchAddInput {
        budgetStatementId: ID!
        name: String
        address: String
        currentBalance: Float
        topupTransfer: Float
        comments: String
    }

    type BudgetStatementBatchAddPayload {
        errors: [Error]
        budgetStatement: [BudgetStatement]
    }

`;

export const resolvers = {
    Query: {
        // coreUnits: (parent, args, context, info) => {}
        budgetStatements: async (_, filter, { dataSources }) => {
            return await dataSources.db.getBudgetStatements(filter.limit, filter.offset)
        },
        budgetStatement: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 2) {
                throw "Choose no more than 2 parameters"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            const secondParamName = queryParams[1];
            const secondParamValue = filter[queryParams[1]];
            return await dataSources.db.getBudgetStatement(paramName, paramValue, secondParamName, secondParamValue)
        },
        budgetStatementFTEs: async (_, __, { dataSources }) => {
            return await dataSources.db.getBudgetStatementFTEs();
        },
        budgetStatementFTE: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.getBudgetStatementFTE(paramName, paramValue)
        },
        budgetStatementMKRVests: async (_, __, { dataSources }) => {
            return await dataSources.db.getBudgetStatementMKRVests();
        },
        budgetStatementMKRVest: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.getBudgetStatementMKRVest(paramName, paramValue)
        },
        budgetStatementWallets: async (_, __, { dataSources }) => {
            return await dataSources.db.getBudgetStatementWallets();
        },
        budgetStatementWallet: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.getBudgetStatementWallet(paramName, paramValue)
        },
        budgetStatementLineItems: async (_, filter, { dataSources }) => {
            return await dataSources.db.getBudgetStatementLineItems(filter.limit, filter.offset);
        },
        budgetStatementLineItem: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.getBudgetStatementLineItem(paramName, paramValue)
        },
        budgetStatementPayments: async (_, __, { dataSources }) => {
            return await dataSources.db.getBudgetStatementPayments();
        },
        budgetStatementPayment: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.getBudgetStatementPayment(paramName, paramValue)
        }

    },
    BudgetStatement: {
        budgetStatementFTEs: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getBudgetStatementFTEs();
            const ftes = result.filter(fte => {
                return fte.budgetStatementId === id;
            })
            return ftes
        },
        budgetStatementMKRVest: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getBudgetStatementMKRVests()
            const vests = result.filter(vest => {
                return vest.budgetStatementId === id;
            })
            return vests;
        },
        budgetStatementWallet: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getBudgetStatementWallets();
            const wallets = result.filter(wallet => {
                return wallet.budgetStatementId === id
            })
            return wallets;
        }
    },
    BudgetStatementWallet: {
        budgetStatementLineItem: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getBudgetStatementLineItems();
            const lineItems = result.filter(lineItem => {
                return lineItem.budgetStatementWalletId === id
            })
            return lineItems;
        },
        budgetStatementPayment: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.getBudgetStatementPayments();
            const payments = result.filter(payment => {
                return payment.budgetStatementWalletId === id
            })
            return payments;
        }
    },
    Mutation: {
        budgetStatementAdd: async (_, __, { dataSources }) => {
            return null;
        },
        budgetStatementsBatchAdd: async (_, { input }, { dataSources }) => {
            if (input.length < 1) {
                return new Error('"No input data')
            }
            const result = await dataSources.db.addBatchBudgetStatements(input);
            return result
        },
        budgetLineItemsBatchAdd: async (_, { input }, { dataSources }) => {
            console.log('input', input)
            const result = await dataSources.db.addBatchtLineItems(input)
            return result;
        },
        budgetLineItemsBatchUpdate: async (_, { input }, { dataSources }) => {
            console.log('batchUpdate Input: ', input)
            return await dataSources.db.batchUpdateLineItems(input)
        },
        budgetLineItemsBatchDelete: async (_, { input }, { dataSources }) => {
            console.log('deleting linteItems', input);
            return await dataSources.db.batchDeleteLineItems(input)
        },
        budgetStatementDelete: async (_, __, { dataSources }) => {
            return null;
        },
        budgetStatementWalletBatchAdd: async (_, { input }, { dataSources }) => {
            return await dataSources.db.addBudgetStatementWallets(input);
        }
    }
}