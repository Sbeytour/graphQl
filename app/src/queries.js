export const getUserInfoQuery = `
{
  user {
    login
    firstName
    lastName
    auditRatio
    totalUp
    totalDown
    transactions(
      where: {eventId: {_eq: 41}, type: {_eq: "level"}}
      order_by: {amount: desc}
      limit: 1
    ) {
      amount
    }
    transactions_aggregate(where: {eventId: {_eq: 41}, type: {_eq: "xp"}}) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
}
`;

export const getSkillsQuery = `
{
  transaction(where: {type: {_ilike: "%skill%"}}) {
    type
    amount
  }
}
`;