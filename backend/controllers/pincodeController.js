const axios = require('axios');

// Local database fallback for common Bangalore pincodes
const bangaloreData = {
    "560001": ["M.G. Road", "Tasker Town", "Bangalore G.P.O.", "Cantonment"],
    "560034": ["Koramangala 4th Block", "Koramangala VI Bk", "Madiwala"],
    "560038": ["Indiranagar", "HAL 2nd Stage", "Domlur"],
    "560066": ["Whitefield", "ITPL", "EPIP Zone"],
    "560100": ["Electronics City", "Konappana Agrahara"],
    "560102": ["HSR Layout", "Agara"]
};

const getAreasByPincode = async (req, res) => {
    const { code } = req.params;

    // Validate Bangalore 6-digit pincode format (starts with 560)
    if (!/^560\d{3}$/.test(code)) {
        return res.status(400).json({
            error: "Please enter a valid 6-digit Bangalore pincode starting with 560."
        });
    }

    try {
        if (bangaloreData[code]) {
            return res.json({ pincode: code, areas: bangaloreData[code], source: 'Local DB' });
        }

        // Query India Post API
        const response = await axios.get(`https://api.postalpincode.in/pincode/${code}`);
        const data = response.data[0];

        if (data.Status === "Success" && data.PostOffice) {
            const areas = data.PostOffice.map(office => office.Name);
            return res.json({ pincode: code, areas, source: 'India Post API' });
        } else {
            return res.status(404).json({ error: "No areas found for this pincode." });
        }
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch pincode details." });
    }
}

module.exports = { getAreasByPincode };
