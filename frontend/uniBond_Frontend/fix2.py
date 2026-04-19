import re

with open("src/pages/professional-communication/ProfessionalCommunication.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("""                    ) : registered ? (
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-emerald-700">
                          You are registered for this session.
                        </p>
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
                        >
                          <Video className="h-4 w-4" />
                          Join Zoom Session
                        </a>
                      </div>""", """                    ) : registered ? (
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-emerald-700">
                          You are registered for this session.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                          <a
                            href={session.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
                          >
                            <Video className="h-4 w-4" />
                            Join Zoom Session
                          </a>
                          <button
                            type="button"
                            onClick={() => void handleUnregister(session.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 font-semibold text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Unregister
                          </button>
                        </div>
                      </div>""")

with open("src/pages/professional-communication/ProfessionalCommunication.tsx", "w", encoding="utf-8") as f:
    f.write(text)