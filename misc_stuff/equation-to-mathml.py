from latex2mathml import converter

# LaTeX equation as a string
latex_eq = r"\Delta t"

# Convert LaTeX to MathML
mathml = converter.convert(latex_eq)

# Wrap the MathML in the required <span> and <math> tags
formatted_mathml = f'<span class="os-math-in-para"><math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">{mathml}</math></span>'

# Print the MathML in the desired format
print(formatted_mathml)
