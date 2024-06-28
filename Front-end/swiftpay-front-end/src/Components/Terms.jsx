import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-blue-500 text-white text-center py-8">
                        <h1 className="text-3xl font-bold">Terms and Conditions</h1>
                    </div>
                    <div className="p-8">
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Welcome to Financial Hub. These terms and conditions outline the rules and regulations for the use of our website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. Intellectual Property Rights</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Other than the content you own, under these Terms, Financial Hub and/or its licensors own all the intellectual property rights and materials contained in this Website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">3. Restrictions</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You are specifically restricted from all of the following:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
                                <li>publishing any Website material in any other media;</li>
                                <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                                <li>publicly performing and/or showing any Website material;</li>
                                <li>using this Website in any way that is or may be damaging to this Website;</li>
                                <li>using this Website in any way that impacts user access to this Website;</li>
                                <li>using this Website contrary to applicable laws and regulations, or in any way that may cause harm to the Website, or to any person or business entity;</li>
                                <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
                                <li>using this Website to engage in any advertising or marketing.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">4. Your Content</h2>
                            <p className="text-gray-700 leading-relaxed">
                                In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Financial Hub a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">5. No warranties</h2>
                            <p className="text-gray-700 leading-relaxed">
                                This Website is provided “as is,” with all faults, and Financial Hub expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">6. Limitation of liability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                In no event shall Financial Hub, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Financial Hub, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">7. Indemnification</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You hereby indemnify to the fullest extent Financial Hub from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">8. Severability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">9. Variation of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Financial Hub is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">10. Assignment</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The Financial Hub is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">11. Entire Agreement</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms constitute the entire agreement between Financial Hub and you in relation to your use of this Website and supersede all prior agreements and understandings.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">12. Governing Law & Jurisdiction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms will be governed by and interpreted in accordance with the laws of the State of [Your State], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State] for the resolution of any disputes.
                            </p>
                        </section>

                        <div className="text-center mt-8">
                            <Link to="/" className="inline-block bg-white text-blue-500 py-2 px-4 rounded border-blue-500">
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsAndConditions;
