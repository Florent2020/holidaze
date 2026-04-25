import PropTypes from  "prop-types";

function SubHeading({ content }) {
	return <h2>{content}</h2>;
}

SubHeading.propTypes = {
	content: PropTypes.string.isRequired,
};

export default SubHeading;
