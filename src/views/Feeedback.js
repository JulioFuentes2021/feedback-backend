const Feedback = require('../model/message');


const findFeedbackById = async (id, userFromClient) => {
    // const feedback = Feedback.updateOne()
    const upvoteBeforeSum = await Feedback.findById(id);

    await Feedback.updateOne({ _id: id }, { $set: { "upvotes": upvoteBeforeSum.upvotes + 1 } })
    // await upvoteBeforeSum.save();

    let sumOrLess;

    const theUserHasUpvote = (user) => user === userFromClient;


    //!Cuando hago 2 veces el poner y eliminar con un elemento extra hay un bug
    // if (upvoteBeforeSum.test.findIndex((user) => user === userFromClient)) {
    //     sumOrLess = 1;
    //     const users = upvoteBeforeSum.test//Aplicar el findIndex
    //     await Feedback.updateOne({ _id: id }, { test: [...users, userFromClient] })
    //     await Feedback.updateOne({ _id: id }, { upvotes: upvoteBeforeSum.upvotes + 1 })
    // }
    // else {
    //     const userToDelete = upvoteBeforeSum.test.indexOf(userFromClient);
    //     const newUsers = upvoteBeforeSum.test.splice(userToDelete, userToDelete + 1)
    //     console.log('New Users; ', newUsers)
    //     console.log('Last users: ', upvoteBeforeSum.test)
    //     await Feedback.updateOne({ _id: id }, { test: [...upvoteBeforeSum.test] })
    //     await Feedback.updateOne({ _id: id }, { upvotes: upvoteBeforeSum.upvotes - 1 })

    // }


    // const arr = ['messi', 'ronaldo', 'Pogba']
    // const index = arr.indexOf('messi')
    // const removedItems = arr.splice(index, index+1) 
    // console.log(arr)

    // console.log(users['Aja'])
}

module.exports = findFeedbackById;