import PropTypes from  "prop-types";

function Heading({ content }) {
	return <h1>{content}</h1>;
}

Heading.propTypes = {
	content: PropTypes.string.isRequired,
};

export default Heading;