const Query = {
    users: async (parent, args, { User }, info) => {
        try {
            if (!args.query) {
                const data = await User.find({});
                return data;
            }
            const data = User.findOne({ name: { $regex: args.query } });
            return data;
        } catch (err) {
            console.log(err);
        }
    },
    user: async (parent, args, { Notes }, info) => {
        try {
            const data = await Notes.findOne({
                _id: "60087eb95df31741a8df5934",
            });
            return data.notes[0].markdown;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    usernotes: async (parent, { email }, { Notes }, info) => {
        try {
            const notes = await Notes.findOne({ email });
            return notes.notes;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    userAvatar: async (parent, { id }, { User }, info) => {
        try {
            const user = await User.findOne({ _id: id });
            return user.img;
        } catch (err) {
            console.log(err);
            return "";
        }
    },
};
module.exports.Query = Query;
